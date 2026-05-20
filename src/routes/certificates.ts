import { Router, Request, Response } from "express";
import PDFDocument from "pdfkit";
import prisma from "../prisma";

const router = Router();

// GET /api/certificates/:enrollmentId — Generate completion certificate
router.get("/:enrollmentId", async (req: Request, res: Response) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: req.params.enrollmentId as string },
      include: {
        user: true,
        course: {
          include: {
            lessons: true,
            instructor: { select: { name: true } },
          },
        },
        progress: { where: { completed: true } },
      },
    });

    if (!enrollment) {
      res.status(404).json({ message: "Enrollment not found" });
      return;
    }

    const totalLessons = enrollment.course.lessons.length;
    const completedLessons = enrollment.progress.length;

    if (completedLessons < totalLessons) {
      res.status(400).json({ message: "Course not completed yet" });
      return;
    }

    // Generate PDF
    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${enrollment.course.title}.pdf`,
    );

    doc.pipe(res);

    // Certificate design
    doc
      .fontSize(40)
      .font("Helvetica-Bold")
      .text("Certificate of Completion", { align: "center" });

    doc.moveDown(2);
    doc
      .fontSize(20)
      .font("Helvetica")
      .text("This certifies that", { align: "center" });

    doc.moveDown(1);
    doc
      .fontSize(30)
      .font("Helvetica-Bold")
      .text(enrollment.user.name, { align: "center" });

    doc.moveDown(1);
    doc
      .fontSize(20)
      .font("Helvetica")
      .text("has successfully completed the course", { align: "center" });

    doc.moveDown(1);
    doc
      .fontSize(25)
      .font("Helvetica-Bold")
      .text(enrollment.course.title, { align: "center" });

    doc.moveDown(2);
    doc
      .fontSize(16)
      .font("Helvetica")
      .text(`Instructor: ${enrollment.course.instructor.name}`, {
        align: "center",
      });

    doc.moveDown(1);
    doc
      .fontSize(14)
      .text(`Date: ${new Date().toLocaleDateString()}`, { align: "center" });

    doc.end();
  } catch (error) {
    console.error("Certificate error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
