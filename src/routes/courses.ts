import { Router, Request, Response } from "express";
import { createClient } from "redis";
import prisma from "../prisma";

const redis = createClient();
redis.on("error", (err) => console.error("Redis error:", err));
redis.connect().then(() => console.log("Redis connected"));

const router = Router();

// GET /api/courses — Get all courses (with Redis cache)
router.get("/", async (req: Request, res: Response) => {
  try {
    const cached = await redis.get("courses:all");

    if (cached) {
      console.log("Serving from cache");
      res.json(JSON.parse(cached));
      return;
    }

    const courses = await prisma.course.findMany({
      include: {
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, lessons: true, reviews: true } },
      },
    });

    // Cache for 1 hour
    await redis.setEx("courses:all", 3600, JSON.stringify(courses));

    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/courses/:id — Get single course (with Redis cache)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cached = await redis.get(`course:${req.params.id}`);

    if (cached) {
      console.log("Serving from cache");
      res.json(JSON.parse(cached));
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: req.params.id as string },
      include: {
        instructor: { select: { id: true, name: true } },
        lessons: { orderBy: { order: "asc" } },
        reviews: { include: { user: { select: { id: true, name: true } } } },
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Cache for 1 hour
    await redis.setEx(`course:${req.params.id}`, 3600, JSON.stringify(course));

    res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/courses — Create a course (invalidate cache)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, price, category, instructorId } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: price || 0,
        category: category || "WEB_DEVELOPMENT",
        instructorId,
      },
    });

    // Invalidate cache
    await redis.del("courses:all");

    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/courses/:id — Update a course (invalidate cache)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    const course = await prisma.course.update({
      where: { id: req.params.id as string },
      data: { title, description, price, category },
    });

    // Invalidate cache
    await redis.del("courses:all");
    await redis.del(`course:${req.params.id}`);

    res.json(course);
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/courses/:id — Delete a course (invalidate cache)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id as string },
    });

    // Invalidate cache
    await redis.del("courses:all");
    await redis.del(`course:${req.params.id}`);

    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
