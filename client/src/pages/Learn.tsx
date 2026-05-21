import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string | null;
  order: number;
}

interface ProgressData {
  completed: number;
  total: number;
  progress: { lessonId: string; completed: boolean }[];
}

const Learn = () => {
  const { id } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get enrollment
        const enrollRes = await api.get(`/enrollments/single/${id}`);
        const enrollment = enrollRes.data;
        setCourseTitle(enrollment.course.title);

        // Get lessons
        const lessonsRes = await api.get(
          `/lessons/course/${enrollment.courseId}`,
        );
        setLessons(lessonsRes.data);
        if (lessonsRes.data.length > 0) {
          setActiveLesson(lessonsRes.data[0]);
        }

        // Get progress
        const progressRes = await api.get(`/progress/${id}`);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [id]);

  const markComplete = async (lessonId: string) => {
    try {
      await api.post("/progress", {
        enrollmentId: id,
        lessonId: lessonId,
      });
      const progressRes = await api.get(`/progress/${id}`);
      setProgress(progressRes.data);
    } catch (err) {
      console.error("Mark complete error:", err);
    }
  };

  const isCompleted = (lessonId: string) => {
    return progress?.progress.some(
      (p) => p.lessonId === lessonId && p.completed,
    );
  };

  const handleCertificate = () => {
    window.open(`http://localhost:5000/api/certificates/${id}`, "_blank");
  };

  const allDone =
    progress && progress.completed === progress.total && progress.total > 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fce4ec" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          background: "white",
          padding: "1.5rem",
          borderRight: "2px solid #f8c8dc",
        }}
      >
        <h3 style={{ color: "#e91e63", marginBottom: "1rem" }}>
          📚 {courseTitle}
        </h3>

        {/* Progress bar */}
        <div
          style={{
            background: "#fce4ec",
            padding: "0.8rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          <p style={{ color: "#e91e63", fontWeight: 600, fontSize: "0.9rem" }}>
            Progress: {progress?.completed || 0}/{progress?.total || 0}
          </p>
          <div
            style={{
              background: "#f8c8dc",
              borderRadius: "10px",
              height: "8px",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                background: "#e91e63",
                borderRadius: "10px",
                height: "100%",
                width: `${
                  progress?.total
                    ? (progress.completed / progress.total) * 100
                    : 0
                }%`,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {/* Lesson list */}
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => setActiveLesson(lesson)}
            style={{
              padding: "0.8rem",
              marginBottom: "0.3rem",
              borderRadius: "8px",
              cursor: "pointer",
              background:
                activeLesson?.id === lesson.id ? "#f8c8dc" : "transparent",
              color: "#666",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: activeLesson?.id === lesson.id ? 600 : 400,
            }}
          >
            <span>{isCompleted(lesson.id) ? "✅" : "📖"}</span>
            <span>
              {lesson.order}. {lesson.title}
            </span>
          </div>
        ))}

        {allDone && (
          <button
            onClick={handleCertificate}
            style={{
              width: "100%",
              marginTop: "1rem",
              padding: "0.8rem",
              background: "#e91e63",
              color: "white",
              border: "none",
              borderRadius: "25px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🎓 Get Certificate
          </button>
        )}
      </div>

      {/* Main area */}
      <div style={{ flex: 1, padding: "2rem" }}>
        {activeLesson && (
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(233, 30, 99, 0.1)",
            }}
          >
            <h2 style={{ color: "#e91e63", marginBottom: "1rem" }}>
              {activeLesson.title}
            </h2>

            {/* Video placeholder */}
            <div
              style={{
                width: "100%",
                height: "250px",
                background: "#fce4ec",
                borderRadius: "8px",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#e91e63",
                fontSize: "1.1rem",
                border: "2px dashed #f8c8dc",
              }}
            >
              📺 Video content for: {activeLesson.title}
            </div>

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    const idx = lessons.findIndex(
                      (l) => l.id === activeLesson.id,
                    );
                    if (idx > 0) setActiveLesson(lessons[idx - 1]);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    border: "2px solid #e91e63",
                    background: "white",
                    color: "#e91e63",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    const idx = lessons.findIndex(
                      (l) => l.id === activeLesson.id,
                    );
                    if (idx < lessons.length - 1)
                      setActiveLesson(lessons[idx + 1]);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    border: "2px solid #e91e63",
                    background: "white",
                    color: "#e91e63",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Next →
                </button>
              </div>

              {isCompleted(activeLesson.id) ? (
                <span style={{ color: "#4caf50", fontWeight: 600 }}>
                  ✅ Completed
                </span>
              ) : (
                <button
                  onClick={() => markComplete(activeLesson.id)}
                  style={{
                    padding: "0.5rem 1.5rem",
                    borderRadius: "25px",
                    background: "#e91e63",
                    color: "white",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✓ Mark Complete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
