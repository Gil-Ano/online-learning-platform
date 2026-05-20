import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// POST /api/reviews — Add a review
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, courseId, rating, comment } = req.body;

    const existing = await prisma.review.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      res.status(400).json({ message: "Already reviewed this course" });
      return;
    }

    const review = await prisma.review.create({
      data: { userId, courseId, rating, comment },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Review error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/reviews/course/:courseId — Get reviews for a course
router.get("/course/:courseId", async (req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { courseId: req.params.courseId as string },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
