import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET /api/courses — Get all courses
router.get("/", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: { select: { id: true, name: true } },
        _count: { select: { enrollments: true, lessons: true, reviews: true } },
      },
    });
    res.json(courses);
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/courses/:id — Get single course
router.get("/:id", async (req: Request, res: Response) => {
  try {
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

    res.json(course);
  } catch (error) {
    console.error("Get course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/courses — Create a course
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

    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/courses/:id — Update a course
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, price, category } = req.body;

    const course = await prisma.course.update({
      where: { id: req.params.id as string },
      data: { title, description, price, category },
    });

    res.json(course);
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/courses/:id — Delete a course
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.id as string },
    });

    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
