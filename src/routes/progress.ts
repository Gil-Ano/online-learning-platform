import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// POST /api/progress — Mark a lesson complete
router.post("/", async (req: Request, res: Response) => {
  try {
    const { enrollmentId, lessonId } = req.body;

    const progress = await prisma.progress.upsert({
      where: {
        enrollmentId_lessonId: { enrollmentId, lessonId },
      },
      update: { completed: true },
      create: { enrollmentId, lessonId, completed: true },
    });

    res.json(progress);
  } catch (error) {
    console.error("Progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/progress/:enrollmentId — Get progress for an enrollment
router.get("/:enrollmentId", async (req: Request, res: Response) => {
  try {
    const progress = await prisma.progress.findMany({
      where: { enrollmentId: req.params.enrollmentId as string },
      include: { lesson: true },
    });

    const totalLessons = await prisma.lesson.count({
      where: { courseId: progress[0]?.lesson.courseId || "" },
    });

    res.json({
      completed: progress.filter((p) => p.completed).length,
      total: totalLessons,
      progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
