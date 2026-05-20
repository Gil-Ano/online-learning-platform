import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// GET /api/dashboard/:instructorId — Instructor dashboard stats
router.get("/:instructorId", async (req: Request, res: Response) => {
  try {
    const instructorId = req.params.instructorId as string;

    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: { select: { enrollments: true, lessons: true, reviews: true } },
        enrollments: { select: { createdAt: true } },
        reviews: { select: { rating: true } },
      },
    });

    const totalStudents = courses.reduce(
      (sum, c) => sum + c._count.enrollments,
      0,
    );

    const totalCourses = courses.length;
    const totalLessons = courses.reduce((sum, c) => sum + c._count.lessons, 0);

    const allRatings = courses.flatMap((c) => c.reviews.map((r) => r.rating));
    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
        : 0;

    res.json({
      totalStudents,
      totalCourses,
      totalLessons,
      averageRating: Math.round(avgRating * 10) / 10,
      courses,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
