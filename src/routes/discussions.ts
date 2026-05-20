import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// POST /api/discussions — Create a discussion post
router.post("/", async (req: Request, res: Response) => {
  try {
    const { content, userId, courseId } = req.body;

    const discussion = await prisma.discussion.create({
      data: { content, userId, courseId },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json(discussion);
  } catch (error) {
    console.error("Discussion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/discussions/course/:courseId — Get discussions for a course
router.get("/course/:courseId", async (req: Request, res: Response) => {
  try {
    const discussions = await prisma.discussion.findMany({
      where: { courseId: req.params.courseId as string },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(discussions);
  } catch (error) {
    console.error("Get discussions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
