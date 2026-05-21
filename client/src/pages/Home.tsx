import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  instructor: { id: string; name: string };
  _count: { enrollments: number; lessons: number; reviews: number };
}

const formatCategory = (cat: string) => {
  return cat
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
};

const Home = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["ALL", ...new Set(courses.map((c) => c.category))];

  return (
    <div style={{ background: "#fce4ec", minHeight: "100vh", padding: "2rem" }}>
      <h1
        style={{
          color: "#e91e63",
          textAlign: "center",
          fontSize: "2.2rem",
          marginBottom: "2rem",
        }}
      >
        ✨ Explore Our Courses ✨
      </h1>

      {/* Search & Filter */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto 2rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.8rem 1.2rem",
            borderRadius: "25px",
            border: "2px solid #f8c8dc",
            outline: "none",
            fontSize: "1rem",
            width: "300px",
            background: "white",
          }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{
            padding: "0.8rem 1.2rem",
            borderRadius: "25px",
            border: "2px solid #f8c8dc",
            outline: "none",
            fontSize: "1rem",
            background: "white",
            color: "#e91e63",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "ALL" ? "📂 All Categories" : formatCategory(cat)}
            </option>
          ))}
        </select>
      </div>

      {/* Course Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {filteredCourses.map((course) => (
          <Link
            to={`/course/${course.id}`}
            key={course.id}
            style={{ textDecoration: "none" }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "1.8rem",
                border: "1px solid #f8c8dc",
                boxShadow: "0 4px 15px rgba(233, 30, 99, 0.1)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(233, 30, 99, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(233, 30, 99, 0.1)";
              }}
            >
              {/* Price Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: course.price === 0 ? "#4caf50" : "#e91e63",
                  color: "white",
                  padding: "0.3rem 0.8rem",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {course.price === 0 ? "FREE" : `$${course.price}`}
              </div>

              <h3
                style={{
                  color: "#e91e63",
                  marginBottom: "0.5rem",
                  fontSize: "1.3rem",
                  paddingRight: "70px",
                }}
              >
                {course.title}
              </h3>

              <p
                style={{
                  color: "#888",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  lineHeight: "1.5",
                }}
              >
                {course.description?.length > 120
                  ? course.description.substring(0, 120) + "..."
                  : course.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.8rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#f8c8dc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e91e63",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {course.instructor.name.charAt(0)}
                </div>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  {course.instructor.name}
                </span>
              </div>

              <span
                style={{
                  display: "inline-block",
                  background: "#fce4ec",
                  color: "#e91e63",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  marginBottom: "0.8rem",
                }}
              >
                {formatCategory(course.category)}
              </span>

              <div
                style={{
                  display: "flex",
                  gap: "1.2rem",
                  fontSize: "0.85rem",
                  color: "#aaa",
                }}
              >
                <span>📚 {course._count.lessons} lessons</span>
                <span>👥 {course._count.enrollments} students</span>
                <span>⭐ {course._count.reviews}</span>
              </div>

              {/* View Course button */}
              <div
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  background: "#fce4ec",
                  color: "#e91e63",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  opacity: 0.9,
                }}
              >
                View Course →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#888",
            marginTop: "3rem",
            fontSize: "1.1rem",
          }}
        >
          No courses found. Try a different search!
        </p>
      )}
    </div>
  );
};

export default Home;
