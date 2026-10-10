import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const courses = [
  {
    id: 1,
    title: "Python for Data Science",
    category: "Programming",
    level: "Beginner",
    lessons: 24,
    duration: "8 hours",
    progress: 68,
    icon: "PY",
    description:
      "Learn Python fundamentals and the tools used for data analysis.",
    recommended: true,
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    category: "AI & ML",
    level: "Intermediate",
    lessons: 32,
    duration: "12 hours",
    progress: 42,
    icon: "ML",
    description:
      "Understand machine learning concepts, algorithms and practical workflows.",
    recommended: true,
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    category: "Programming",
    level: "Intermediate",
    lessons: 40,
    duration: "15 hours",
    progress: 81,
    icon: "DS",
    description:
      "Strengthen your problem-solving skills with essential DSA concepts.",
    recommended: false,
  },
  {
    id: 4,
    title: "React & Modern Frontend",
    category: "Web Development",
    level: "Intermediate",
    lessons: 28,
    duration: "10 hours",
    progress: 25,
    icon: "RE",
    description:
      "Build modern responsive applications using React and frontend tools.",
    recommended: false,
  },
  {
    id: 5,
    title: "SQL & Database Essentials",
    category: "Data",
    level: "Beginner",
    lessons: 20,
    duration: "7 hours",
    progress: 0,
    icon: "SQL",
    description:
      "Learn relational databases, SQL queries and practical database design.",
    recommended: true,
  },
  {
    id: 6,
    title: "Cloud Computing Basics",
    category: "Cloud",
    level: "Beginner",
    lessons: 18,
    duration: "6 hours",
    progress: 0,
    icon: "CL",
    description:
      "Understand cloud computing concepts, services and deployment basics.",
    recommended: false,
  },
];

const categories = [
  "All",
  "Programming",
  "AI & ML",
  "Web Development",
  "Data",
  "Cloud",
];

function getRecommendedCourses(assessment) {
  if (!assessment) {
    return courses.filter((course) => course.recommended);
  }

  const highestScore = Math.max(
    assessment.aiMlScore,
    assessment.dataScientistScore,
    assessment.softwareEngineerScore
  );

  if (highestScore === assessment.softwareEngineerScore) {
    return courses.filter(
      (course) =>
        course.title === "Data Structures & Algorithms" ||
        course.title === "React & Modern Frontend" ||
        course.title === "SQL & Database Essentials"
    );
  }

  if (highestScore === assessment.aiMlScore) {
    return courses.filter(
      (course) =>
        course.title === "Python for Data Science" ||
        course.title === "Machine Learning Fundamentals" ||
        course.title === "SQL & Database Essentials"
    );
  }

  return courses.filter(
    (course) =>
      course.title === "Python for Data Science" ||
      course.title === "SQL & Database Essentials" ||
      course.title === "Data Structures & Algorithms"
  );
}

function Learning() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [assessment, setAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(true);

  const [courseProgress, setCourseProgress] = useState({});
  const [progressLoading, setProgressLoading] = useState(true);

  // --------------------------------------------------
  // FETCH CAREER ASSESSMENT
  // --------------------------------------------------

  useEffect(() => {
    const fetchAssessment = async () => {
      const storedUser =
        localStorage.getItem("careerbridgeUser");

      if (!storedUser) {
        setAssessmentLoading(false);
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        if (!user?.id) {
          setAssessmentLoading(false);
          return;
        }

        const response = await fetch(
          `https://careerbridge-backend-rw9x.onrender.com/api/assessment/user/${user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          setAssessment(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch assessment:",
          error
        );
      } finally {
        setAssessmentLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  // --------------------------------------------------
  // FETCH COURSE PROGRESS FROM MYSQL
  // --------------------------------------------------

  useEffect(() => {
    const fetchCourseProgress = async () => {
      const storedUser =
        localStorage.getItem("careerbridgeUser");

      if (!storedUser) {
        setProgressLoading(false);
        return;
      }

      try {
        const user = JSON.parse(storedUser);

        if (!user?.id) {
          setProgressLoading(false);
          return;
        }

        const progressResults = {};

        for (const course of courses) {
          try {
            const response = await fetch(
              `https://careerbridge-backend-rw9x.onrender.com/api/course-progress/user/${user.id}/course/${course.id}`
            );

            if (response.ok) {
              const data = await response.json();

              progressResults[course.id] =
                data.progress;
            }
          } catch (error) {
            console.error(
              `Failed to fetch progress for course ${course.id}:`,
              error
            );
          }
        }

        setCourseProgress(progressResults);
      } catch (error) {
        console.error(
          "Failed to fetch course progress:",
          error
        );
      } finally {
        setProgressLoading(false);
      }
    };

    fetchCourseProgress();
  }, []);

  // --------------------------------------------------
  // COMBINE STATIC COURSE DATA + DATABASE PROGRESS
  // --------------------------------------------------

  const coursesWithProgress = useMemo(() => {
    return courses.map((course) => ({
      ...course,
      progress:
        courseProgress[course.id] !== undefined
          ? courseProgress[course.id]
          : course.progress,
    }));
  }, [courseProgress]);

  // --------------------------------------------------
  // RECOMMENDED COURSES
  // --------------------------------------------------

  const recommendedCourses = useMemo(() => {
    return getRecommendedCourses(assessment);
  }, [assessment]);

  // --------------------------------------------------
  // FILTER COURSES
  // --------------------------------------------------

  const filteredCourses = useMemo(() => {
    const filtered = coursesWithProgress.filter(
      (course) => {
        const matchesCategory =
          selectedCategory === "All" ||
          course.category === selectedCategory;

        const searchText = search.toLowerCase();

        const matchesSearch =
          course.title
            .toLowerCase()
            .includes(searchText) ||
          course.category
            .toLowerCase()
            .includes(searchText);

        return matchesCategory && matchesSearch;
      }
    );

    return filtered.sort((a, b) => {
      const aRecommended = recommendedCourses.some(
        (course) => course.id === a.id
      );

      const bRecommended = recommendedCourses.some(
        (course) => course.id === b.id
      );

      return Number(bRecommended) - Number(aRecommended);
    });
  }, [
    selectedCategory,
    search,
    recommendedCourses,
    coursesWithProgress,
  ]);

  // --------------------------------------------------
  // OVERALL LEARNING PROGRESS
  // --------------------------------------------------

  const learningProgress = Math.round(
    coursesWithProgress.reduce(
      (total, course) => total + course.progress,
      0
    ) / coursesWithProgress.length
  );

  // --------------------------------------------------
  // COURSES CURRENTLY IN PROGRESS
  // --------------------------------------------------

  const coursesInProgress =
    coursesWithProgress.filter(
      (course) =>
        course.progress > 0 &&
        course.progress < 100
    ).length;

  // --------------------------------------------------
  // RECOMMENDED CAREER
  // --------------------------------------------------

  const recommendedCareer = assessment
    ? assessment.softwareEngineerScore >=
        assessment.aiMlScore &&
      assessment.softwareEngineerScore >=
        assessment.dataScientistScore
      ? "Software Engineer"
      : assessment.aiMlScore >=
        assessment.dataScientistScore
      ? "AI / ML Engineer"
      : "Data Scientist"
    : null;

  return (
    <div className="learning-page">

      {/* SIDEBAR */}

      <Sidebar/>


      {/* MAIN */}

      <main className="learning-main">

        <header className="learning-topbar">

          <div className="learning-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search courses and skills..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="learning-top-user">

            <span className="learning-notification">
              ♢
            </span>

            <Link to="/profile">
              <div className="learning-avatar">
                C
              </div>
            </Link>

          </div>

        </header>


        <div className="learning-content">

          {/* HERO */}

          <section className="learning-hero">

            <div>

              <span className="learning-eyebrow">
                CAREER DEVELOPMENT
              </span>

              <h1>
                Learn skills that
                <br />
                move you forward.
              </h1>

              <p>
                Build practical skills, complete courses,
                and prepare yourself for the opportunities
                ahead.
              </p>

            </div>

            <div className="learning-hero-stat">

              <span>
                YOUR LEARNING
              </span>

              <strong>
                {learningProgress}%
              </strong>

              <small>
                Learning progress
              </small>

              <div className="hero-progress">

                <div
                  style={{
                    width: `${learningProgress}%`,
                  }}
                />

              </div>

            </div>

          </section>


          {/* CONTINUE LEARNING */}

          <section className="learning-section">

            <div className="learning-section-heading">

              <div>

                <span>
                  PICK UP WHERE YOU LEFT OFF
                </span>

                <h2>
                  Continue learning
                </h2>

              </div>

              <span className="learning-count">
                {coursesInProgress} courses in progress
              </span>

            </div>


            <div className="continue-grid">

              {coursesWithProgress
                .filter(
                  (course) =>
                    course.progress > 0
                )
                .slice(0, 3)
                .map((course) => (

                  <div
                    className="continue-card"
                    key={course.id}
                  >

                    <div className="continue-icon">
                      {course.icon}
                    </div>

                    <div className="continue-content">

                      <span>
                        {course.category}
                      </span>

                      <h3>
                        {course.title}
                      </h3>

                      <div className="continue-progress-row">

                        <div className="course-progress">

                          <div
                            style={{
                              width: `${course.progress}%`,
                            }}
                          />

                        </div>

                        <strong>
                          {course.progress}%
                        </strong>

                      </div>

                      <Link
                        to={`/learning/course/${course.id}`}
                        className="continue-course-button"
                      >
                        Continue →
                      </Link>

                    </div>

                  </div>

                ))}

            </div>

          </section>


          {/* COURSE CATALOGUE */}

          <section
            className="learning-section"
            id="course-library"
          >

            <div className="learning-section-heading">

              <div>

                <span>
                  EXPLORE
                </span>

                <h2>
                  Course library
                </h2>

              </div>

              <span className="learning-count">
                {filteredCourses.length} courses
              </span>

            </div>


            {/* FILTERS */}

            <div className="learning-filters">

              {categories.map((category) => (

                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  {category}
                </button>

              ))}

            </div>


            {/* COURSE GRID */}

            <div className="course-library-grid">

              {filteredCourses.map((course) => (

                <article
                  className="library-course-card"
                  key={course.id}
                >

                  <div className="library-course-top">

                    <div className="library-course-icon">
                      {course.icon}
                    </div>

                    {recommendedCourses.some(
                      (recommendedCourse) =>
                        recommendedCourse.id ===
                        course.id
                    ) && (

                      <span className="recommended-badge">
                        RECOMMENDED
                      </span>

                    )}

                  </div>

                  <span className="library-course-category">
                    {course.category}
                  </span>

                  <h3>
                    {course.title}
                  </h3>

                  <p>
                    {course.description}
                  </p>

                  <div className="library-course-meta">

                    <span>
                      {course.level}
                    </span>

                    <span>
                      {course.lessons} lessons
                    </span>

                    <span>
                      {course.duration}
                    </span>

                  </div>

                  {course.progress > 0 && (

                    <div className="library-course-progress">

                      <div>

                        <span>
                          Progress
                        </span>

                        <strong>
                          {course.progress}%
                        </strong>

                      </div>

                      <div className="course-progress">

                        <div
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />

                      </div>

                    </div>

                  )}

                  <Link
                    to={`/learning/course/${course.id}`}
                    className="course-action"
                  >

                    {course.progress > 0
                      ? "Continue Course"
                      : "Start Course"}

                    <span>
                      →
                    </span>

                  </Link>

                </article>

              ))}

            </div>


            {filteredCourses.length === 0 && (

              <div className="learning-empty">

                <strong>
                  No courses found
                </strong>

                <p>
                  Try a different search or category.
                </p>

              </div>

            )}

          </section>


          {/* SKILL CTA */}

          <section className="learning-bottom">

            <div>

              <span>
                PERSONALIZED LEARNING
              </span>

              <h2>
                {assessment
                  ? `Build toward ${recommendedCareer}`
                  : "Not sure what to learn next?"}
              </h2>

              <p>
                {assessment
                  ? `Based on your Career Assessment, we've selected courses to help you prepare for a ${recommendedCareer} career.`
                  : "Complete your Career Assessment and we'll recommend skills and courses based on your career direction."}
              </p>

              {assessment &&
                recommendedCourses.length > 0 && (

                  <div className="recommended-summary">

                    <strong>
                      Recommended courses:{" "}
                      {recommendedCourses.length}
                    </strong>

                    <p>
                      These courses are selected based
                      on your{" "}
                      {recommendedCareer} assessment result.
                    </p>

                  </div>

                )}

              <a
                href="#course-library"
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  padding: "12px 20px",
                  background: "#111827",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                View Recommended Courses →
              </a>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Learning;