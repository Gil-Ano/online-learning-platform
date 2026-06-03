# ✨ GirlyGeek — Online Learning Platform

> A full-stack online learning platform built with React, Node.js, TypeScript, PostgreSQL, and Stripe. Features course browsing, progress tracking, quizzes, certificates, and payments.

![GirlyGeek](https://img.shields.io/badge/status-demo%20ready-pink)

## 🌐 Live Demo

- **Frontend:** [https://girlygeek.vercel.app](https://girlygeek.vercel.app)
- **Backend API:** [https://girlygeek-api.onrender.com](https://girlygeek-api.onrender.com)

> ⚠️ Note: Backend is hosted on Render free tier and may take 30-60 seconds to wake up on first request.

---

## ✨ Features

- 🔐 **JWT Authentication** — Register, login, logout with secure token-based auth and protected routes
- 📚 **Course Catalog** — Browse 6 courses across 5 categories with search and filter
- 🎥 **Course Detail Pages** — View lessons, instructor info, reviews, and enroll
- 📖 **Learning Page** — Read lesson notes, take quizzes, track progress with progress bar
- 📝 **Quiz System** — Auto-generated quizzes per lesson with instant feedback
- 🎓 **Certificate Generation** — Download PDF certificate on course completion
- 💳 **Stripe Payments** — Purchase paid courses with Stripe checkout
- 📊 **Student Dashboard** — View enrolled courses and progress
- 👩‍🏫 **Instructor Dashboard** — Track student count, course stats, average rating
- 💬 **Discussion Forum** — Per-course student discussions
- ⭐ **Reviews & Ratings** — Rate and review completed courses
- ⚡ **Redis Caching** — Fast course listings with automatic cache invalidation
- 📱 **Responsive Design** — Pink and white theme, works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### Payments & Auth

![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

---

## 📂 Project Structure

```
online-learning-platform/
├── client/ # React frontend
│ └── src/
│ ├── components/
│ │ └── Navbar.tsx # Navigation with auth state
│ ├── pages/
│ │ ├── Home.tsx # Course grid with search & filter
│ │ ├── CourseDetail.tsx # Course info + enroll/buy
│ │ ├── Learn.tsx # Lesson viewer + quizzes + progress
│ │ ├── Login.tsx # Login form
│ │ ├── Register.tsx # Register form
│ │ ├── Dashboard.tsx # Student enrollments
│ │ ├── Success.tsx # Stripe payment success
│ │ └── Cancel.tsx # Stripe payment cancel
│ ├── services/
│ │ └── api.ts # Axios instance with JWT interceptor
│ └── App.tsx # Routes configuration
├── src/ # Backend
│ ├── middleware/
│ │ └── auth.ts # JWT protect & instructor middleware
│ ├── routes/
│ │ ├── auth.ts # Register, login, profile update
│ │ ├── courses.ts # Course CRUD + Redis caching
│ │ ├── lessons.ts # Lesson management
│ │ ├── enrollments.ts # Course enrollment
│ │ ├── progress.ts # Progress tracking
│ │ ├── quizzes.ts # Quiz generation & submission
│ │ ├── reviews.ts # Course ratings & reviews
│ │ ├── discussions.ts # Discussion forum
│ │ ├── certificates.ts # PDF certificate generation
│ │ ├── payments.ts # Stripe checkout & webhooks
│ │ └── dashboard.ts # Instructor stats
│ ├── prisma.ts # Prisma client with PostgreSQL adapter
│ └── index.ts # Express app entry point
├── prisma/
│ └── schema.prisma # Database schema (8 models)
└── .env # Environment variables

```

---

## 📡 API Endpoints

### Auth

| Method | Endpoint             | Description         | Auth   |
| ------ | -------------------- | ------------------- | ------ |
| POST   | `/api/auth/register` | Register new user   | Public |
| POST   | `/api/auth/login`    | Login user          | Public |
| PUT    | `/api/auth/profile`  | Update user profile | Public |

### Courses

| Method | Endpoint           | Description              | Auth   |
| ------ | ------------------ | ------------------------ | ------ |
| GET    | `/api/courses`     | Get all courses (cached) | Public |
| GET    | `/api/courses/:id` | Get single course        | Public |
| POST   | `/api/courses`     | Create course            | Public |
| PUT    | `/api/courses/:id` | Update course            | Public |
| DELETE | `/api/courses/:id` | Delete course            | Public |

### Lessons

| Method | Endpoint                  | Description            | Auth   |
| ------ | ------------------------- | ---------------------- | ------ |
| GET    | `/api/lessons/course/:id` | Get lessons for course | Public |
| POST   | `/api/lessons`            | Create lesson          | Public |
| PUT    | `/api/lessons/:id`        | Update lesson          | Public |
| DELETE | `/api/lessons/:id`        | Delete lesson          | Public |

### Enrollments & Progress

| Method | Endpoint                      | Description           | Auth   |
| ------ | ----------------------------- | --------------------- | ------ |
| POST   | `/api/enrollments`            | Enroll in course      | Public |
| GET    | `/api/enrollments/:userId`    | Get user enrollments  | Public |
| GET    | `/api/enrollments/single/:id` | Get single enrollment | Public |
| POST   | `/api/progress`               | Mark lesson complete  | Public |
| GET    | `/api/progress/:enrollmentId` | Get progress stats    | Public |

### Quizzes

| Method | Endpoint                    | Description             | Auth   |
| ------ | --------------------------- | ----------------------- | ------ |
| POST   | `/api/quizzes/generate/:id` | Generate quiz questions | Public |
| GET    | `/api/quizzes/lesson/:id`   | Get quizzes for lesson  | Public |
| POST   | `/api/quizzes/submit`       | Submit quiz answer      | Public |

### Reviews & Discussions

| Method | Endpoint                      | Description            | Auth   |
| ------ | ----------------------------- | ---------------------- | ------ |
| POST   | `/api/reviews`                | Add course review      | Public |
| GET    | `/api/reviews/course/:id`     | Get course reviews     | Public |
| POST   | `/api/discussions`            | Create discussion post | Public |
| GET    | `/api/discussions/course/:id` | Get course discussions | Public |

### Payments

| Method | Endpoint                 | Description            | Auth   |
| ------ | ------------------------ | ---------------------- | ------ |
| POST   | `/api/payments/checkout` | Create Stripe session  | Public |
| POST   | `/api/payments/webhook`  | Stripe webhook handler | Public |

### Certificates & Dashboard

| Method | Endpoint                       | Description              | Auth   |
| ------ | ------------------------------ | ------------------------ | ------ |
| GET    | `/api/certificates/:id`        | Download PDF certificate | Public |
| GET    | `/api/dashboard/:instructorId` | Instructor stats         | Public |

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis (optional, for caching)
- Stripe account (free, for payments)

### Backend Setup

```bash
cd online-learning-platform
npm install

# Create .env file
DATABASE_URL=postgresql://postgres:password@localhost:5432/online_learning
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
PORT=5000

# Run database migrations
npx prisma migrate dev
npx prisma generate

# Start Redis (optional)
redis-server

# Start server
npm run dev

Frontend Setup

cd client

npm install

npm run dev

🎓 Quiz System
GirlyGeek includes an auto-generated quiz system for each lesson:

Student clicks "Take Quiz" on any lesson

System generates 3 multiple-choice questions based on the lesson topic

Student selects answers and gets instant feedback (✅ or ❌)

Previous quizzes are replaced when regenerated

This reinforces learning and makes the platform interactive without manual quiz creation.

📜 Certificate Generation
When a student completes all lessons in a course:

Progress bar reaches 100%

"🎓 Get Certificate" button appears

Clicking generates a professional PDF certificate with:

Student name

Course title

Instructor name

Completion date

Certificate downloads automatically

Built with PDFKit for server-side PDF generation.


## 🚀 Deployment

| Service  | Platform | URL |
| -------- | -------- | --- |
| Frontend | Vercel   | —   |
| Backend  | Render   | —   |
| Database | —        | —   |


🔮 Future Improvements

Video upload support (Cloudinary)

AI-powered quiz generation (Groq/Llama)

Email notifications (Nodemailer)

Admin panel for platform management

Course bookmarking and wishlists

Unit and integration tests (Jest)

Real-time discussion with WebSockets

👩‍💻 Author
Gil — Final year IT student from Zimbabwe, building towards a remote full stack engineering role.

GitHub: @Gil-Ano

Built with 💖 from Zimbabwe 🇿🇼
```
