import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// POST /api/quizzes/generate/:lessonId — Generate quiz for a lesson
router.post("/generate/:lessonId", async (req: Request, res: Response) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.lessonId as string },
    });

    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    // Generate 3 simple quiz questions based on lesson title
    const questions = [
      {
        question: `What is the main topic of "${lesson.title}"?`,
        options: [
          lesson.title,
          "Python Basics",
          "CSS Styling",
          "Database Design",
        ],
        answer: 0,
      },
      {
        question: `Which of these is related to "${lesson.title}"?`,
        options: [
          "Advanced concepts",
          "Beginner fundamentals",
          "Real-world projects",
          "All of the above",
        ],
        answer: 3,
      },
      {
        question: `Why is "${lesson.title}" important?`,
        options: [
          "It's optional",
          "Foundation for advanced topics",
          "No reason",
          "Only for experts",
        ],
        answer: 1,
      },
    ];

    // Delete old quizzes for this lesson
    await prisma.quiz.deleteMany({
      where: { lessonId: req.params.lessonId as string },
    });

    // Create new quizzes
    const quizzes = await Promise.all(
      questions.map((q) =>
        prisma.quiz.create({
          data: {
            question: q.question,
            options: q.options,
            answer: q.answer,
            lessonId: req.params.lessonId as string,
          },
        }),
      ),
    );

    res.status(201).json(quizzes);
  } catch (error) {
    console.error("Generate quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/quizzes/lesson/:lessonId — Get quizzes for a lesson
router.get("/lesson/:lessonId", async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: req.params.lessonId as string },
    });

    res.json(quizzes);
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/quizzes/submit — Submit quiz answers
router.post("/submit", async (req: Request, res: Response) => {
  try {
    const { quizId, selectedOption } = req.body;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    const correct = quiz.answer === selectedOption;

    res.json({ correct, correctAnswer: correct ? null : quiz.answer });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
