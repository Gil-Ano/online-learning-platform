import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// POST /api/enrollments — Enroll in a course
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      res.status(400).json({ message: "Already enrolled" });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/enrollments/:userId — Get user's enrollments
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.params.userId as string },
      include: {
        course: true,
        progress: true,
      },
    });

    res.json(enrollments);
  } catch (error) {
    console.error("Get enrollments error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
