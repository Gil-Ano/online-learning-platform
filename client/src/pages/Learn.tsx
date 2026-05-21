import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  order: number;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  answer: number;
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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [quizResults, setQuizResults] = useState<
    Record<string, boolean | null>
  >({});
  const [quizGenerated, setQuizGenerated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrollRes = await api.get(`/enrollments/single/${id}`);
        const enrollment = enrollRes.data;
        setCourseTitle(enrollment.course.title);

        const lessonsRes = await api.get(
          `/lessons/course/${enrollment.courseId}`,
        );
        setLessons(lessonsRes.data);
        if (lessonsRes.data.length > 0) setActiveLesson(lessonsRes.data[0]);

        const progressRes = await api.get(`/progress/${id}`);
        setProgress(progressRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [id]);

  const loadQuizzes = async (lessonId: string) => {
    try {
      const res = await api.get(`/quizzes/lesson/${lessonId}`);
      if (res.data.length === 0) {
        // Generate quizzes
        await api.post(`/quizzes/generate/${lessonId}`);
        const newRes = await api.get(`/quizzes/lesson/${lessonId}`);
        setQuizzes(newRes.data);
      } else {
        setQuizzes(res.data);
      }
      setQuizGenerated(true);
      setSelectedAnswers({});
      setQuizResults({});
    } catch (err) {
      console.error("Quiz error:", err);
    }
  };

  const submitQuiz = async (quizId: string, selectedOption: number) => {
    try {
      const res = await api.post("/quizzes/submit", { quizId, selectedOption });
      setQuizResults((prev) => ({ ...prev, [quizId]: res.data.correct }));
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const markComplete = async (lessonId: string) => {
    try {
      await api.post("/progress", { enrollmentId: id, lessonId });
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
  const allQuizzesPassed = quizzes.every((q) => quizResults[q.id] === true);

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
                width: `${progress?.total ? (progress.completed / progress.total) * 100 : 0}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => {
              setActiveLesson(lesson);
              setQuizGenerated(false);
              setQuizzes([]);
            }}
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

            {/* Lesson Content */}
            {activeLesson.content ? (
              <div
                style={{
                  background: "#fafafa",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  color: "#444",
                  lineHeight: "1.8",
                  fontSize: "1rem",
                  border: "1px solid #f8c8dc",
                  whiteSpace: "pre-wrap",
                }}
              >
                {activeLesson.content}
              </div>
            ) : (
              <div
                style={{
                  padding: "2rem",
                  background: "#fce4ec",
                  borderRadius: "8px",
                  marginBottom: "1.5rem",
                  textAlign: "center",
                  color: "#e91e63",
                  border: "2px dashed #f8c8dc",
                }}
              >
                📝 No notes for this lesson yet
              </div>
            )}

            {/* Quiz Section */}
            {!quizGenerated ? (
              <button
                onClick={() => loadQuizzes(activeLesson.id)}
                style={{
                  padding: "0.8rem 2rem",
                  borderRadius: "25px",
                  background: "#f8c8dc",
                  color: "#e91e63",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                }}
              >
                📝 Take Quiz
              </button>
            ) : (
              <div
                style={{
                  marginBottom: "1.5rem",
                  border: "1px solid #f8c8dc",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <h4 style={{ color: "#e91e63", marginBottom: "1rem" }}>
                  Quiz Time!
                </h4>
                {quizzes.map((quiz, idx) => (
                  <div
                    key={quiz.id}
                    style={{
                      marginBottom: "1rem",
                      padding: "0.8rem",
                      background: "#fafafa",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        color: "#666",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                      }}
                    >
                      Q{idx + 1}: {quiz.question}
                    </p>
                    {quiz.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        style={{
                          display: "block",
                          marginBottom: "0.3rem",
                          color: "#555",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name={quiz.id}
                          checked={selectedAnswers[quiz.id] === optIdx}
                          onChange={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [quiz.id]: optIdx,
                            }))
                          }
                          disabled={quizResults[quiz.id] !== undefined}
                          style={{ marginRight: "0.5rem" }}
                        />
                        {option}
                        {quizResults[quiz.id] !== undefined &&
                          optIdx === quiz.answer &&
                          " ✅"}
                        {quizResults[quiz.id] === false &&
                          selectedAnswers[quiz.id] === optIdx &&
                          " ❌"}
                      </label>
                    ))}
                    {quizResults[quiz.id] === undefined && (
                      <button
                        onClick={() =>
                          submitQuiz(quiz.id, selectedAnswers[quiz.id] ?? -1)
                        }
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.4rem 1rem",
                          background: "#e91e63",
                          color: "white",
                          border: "none",
                          borderRadius: "15px",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                        }}
                      >
                        Submit
                      </button>
                    )}
                    {quizResults[quiz.id] === true && (
                      <p style={{ color: "#4caf50", marginTop: "0.3rem" }}>
                        Correct! 🎉
                      </p>
                    )}
                    {quizResults[quiz.id] === false && (
                      <p style={{ color: "#e91e63", marginTop: "0.3rem" }}>
                        Wrong answer
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

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
                    if (idx > 0) {
                      setActiveLesson(lessons[idx - 1]);
                      setQuizGenerated(false);
                      setQuizzes([]);
                    }
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
                    if (idx < lessons.length - 1) {
                      setActiveLesson(lessons[idx + 1]);
                      setQuizGenerated(false);
                      setQuizzes([]);
                    }
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
