import { Router, Request, Response } from "express";
import Stripe from "stripe";
import prisma from "../prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
});

const router = Router();

// POST /api/payments/checkout — Create Stripe checkout session
router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId as string },
    });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.price === 0) {
      res.status(400).json({ message: "Course is free, just enroll" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        courseId: course.id,
        userId: userId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ message: "Payment error" });
  }
});

// POST /api/payments/webhook — Stripe webhook
router.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const event = stripe.webhooks.constructEvent(
      JSON.stringify(req.body),
      sig,
      endpointSecret || "",
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { courseId, userId } = session.metadata || {};

      if (courseId && userId) {
        // Auto-enroll the student
        const existing = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: { userId, courseId },
          },
        });

        if (!existing) {
          await prisma.enrollment.create({
            data: { userId, courseId },
          });
          console.log(`Enrolled ${userId} in ${courseId} via Stripe`);
        }
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ message: "Webhook error" });
  }
});

export default router;
