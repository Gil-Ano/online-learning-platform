import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";
import authRoutes from "./routes/auth";
import courseRoutes from "./routes/courses";
import enrollmentRoutes from "./routes/enrollments";
import lessonRoutes from "./routes/lessons";
import progressRoutes from "./routes/progress";
import reviewRoutes from "./routes/reviews";
import { protect } from "./middleware/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Test DB connection
prisma
  .$connect()
  .then(() => console.log("Database connected"))
  .catch((err: any) => console.error("Database connection error:", err));

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Online Learning Platform API is running" });
});

app.get("/api/profile", protect, (req: any, res) => {
  res.json({ message: "Protected data", user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
