import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// POST /api/lessons — Add a lesson
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl, order, courseId } = req.body;

    const lesson = await prisma.lesson.create({
      data: { title, content, videoUrl, order, courseId },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("Create lesson error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/lessons/course/:courseId — Get lessons for a course
router.get("/course/:courseId", async (req: Request, res: Response) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: req.params.courseId as string },
      orderBy: { order: "asc" },
    });

    res.json(lessons);
  } catch (error) {
    console.error("Get lessons error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/lessons/:id — Update a lesson
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl, order } = req.body;

    const lesson = await prisma.lesson.update({
      where: { id: req.params.id as string },
      data: { title, content, videoUrl, order },
    });

    res.json(lesson);
  } catch (error) {
    console.error("Update lesson error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/lessons/:id — Delete a lesson
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.lesson.delete({
      where: { id: req.params.id as string },
    });

    res.json({ message: "Lesson deleted" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
