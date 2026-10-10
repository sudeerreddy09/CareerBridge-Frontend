import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const courseData = {
  1: {
    title: "Python for Data Science",
    description:
      "Learn Python fundamentals and the tools used for data analysis.",
    progress: 68,
    lessons: [
      {
        title: "Introduction to Python",
        description:
          "Learn the basics of Python, its syntax, variables and why Python is widely used in data science.",
      },
      {
        title: "Variables and Data Types",
        description:
          "Understand variables, strings, numbers, lists and other important Python data types.",
      },
      {
        title: "Conditions and Loops",
        description:
          "Learn how to make decisions and repeat tasks using if statements and loops.",
      },
      {
        title: "Functions",
        description:
          "Understand how functions work and how to create reusable Python code.",
      },
      {
        title: "Lists and Dictionaries",
        description:
          "Work with important Python data structures used for organizing and processing data.",
      },
      {
        title: "Introduction to NumPy",
        description:
          "Learn the basics of NumPy and how it helps with numerical computing.",
      },
    ],
  },

  2: {
    title: "Machine Learning Fundamentals",
    description:
      "Build your understanding of machine learning, algorithms and practical AI concepts.",
    progress: 42,
    lessons: [
      {
        title: "Introduction to Machine Learning",
        description:
          "In this lesson, you'll learn what machine learning is, how it works and where it is used in real-world applications.",
      },
      {
        title: "Supervised Learning",
        description:
          "Learn how supervised learning uses labelled data to train models for prediction and classification tasks.",
      },
      {
        title: "Unsupervised Learning",
        description:
          "Understand how unsupervised learning discovers patterns and groups in data without labelled answers.",
      },
      {
        title: "Regression",
        description:
          "Learn how regression algorithms are used to predict continuous numerical values.",
      },
      {
        title: "Classification",
        description:
          "Understand how classification algorithms assign data to different categories or classes.",
      },
      {
        title: "Model Evaluation",
        description:
          "Learn how to evaluate machine learning models using appropriate performance metrics.",
      },
    ],
  },

  3: {
    title: "Data Structures & Algorithms",
    description:
      "Strengthen your problem-solving skills with essential DSA concepts.",
    progress: 81,
    lessons: [
      {
        title: "Introduction to DSA",
        description:
          "Understand the importance of data structures and algorithms in programming.",
      },
      {
        title: "Arrays",
        description:
          "Learn how arrays store and organize collections of data.",
      },
      {
        title: "Linked Lists",
        description:
          "Understand nodes, pointers and different types of linked lists.",
      },
      {
        title: "Stacks and Queues",
        description:
          "Learn the concepts and applications of stacks and queues.",
      },
      {
        title: "Trees",
        description:
          "Understand tree structures and common tree traversal techniques.",
      },
      {
        title: "Graphs",
        description:
          "Learn the basics of graphs and graph traversal algorithms.",
      },
    ],
  },

  4: {
    title: "React & Modern Frontend",
    description:
      "Build modern responsive applications using React and frontend tools.",
    progress: 25,
    lessons: [
      {
        title: "Introduction to React",
        description:
          "Understand React and why it is used to build modern web applications.",
      },
      {
        title: "Components",
        description:
          "Learn how React components are created and reused.",
      },
      {
        title: "Props",
        description:
          "Understand how data is passed between React components.",
      },
      {
        title: "State",
        description:
          "Learn how state allows React applications to respond to user interactions.",
      },
      {
        title: "Hooks",
        description:
          "Understand important React hooks such as useState and useEffect.",
      },
      {
        title: "React Router",
        description:
          "Learn how to create multiple pages and navigation in React applications.",
      },
    ],
  },

  5: {
    title: "SQL & Database Essentials",
    description:
      "Learn relational databases, SQL queries and practical database design.",
    progress: 0,
    lessons: [
      {
        title: "Introduction to Databases",
        description:
          "Understand databases, tables and how applications store information.",
      },
      {
        title: "SQL Basics",
        description:
          "Learn SELECT, INSERT, UPDATE and DELETE commands.",
      },
      {
        title: "Filtering Data",
        description:
          "Learn how WHERE, ORDER BY and other SQL clauses work.",
      },
      {
        title: "Joins",
        description:
          "Understand how SQL joins combine information from multiple tables.",
      },
      {
        title: "Aggregation",
        description:
          "Learn GROUP BY, COUNT, SUM, AVG and other aggregate functions.",
      },
      {
        title: "Database Design",
        description:
          "Understand the basics of designing efficient relational databases.",
      },
    ],
  },

  6: {
    title: "Cloud Computing Basics",
    description:
      "Understand cloud computing concepts, services and deployment basics.",
    progress: 0,
    lessons: [
      {
        title: "Introduction to Cloud Computing",
        description:
          "Understand what cloud computing is and why organizations use it.",
      },
      {
        title: "Cloud Service Models",
        description:
          "Learn about IaaS, PaaS and SaaS.",
      },
      {
        title: "Cloud Deployment Models",
        description:
          "Understand public, private and hybrid cloud environments.",
      },
      {
        title: "Cloud Storage",
        description:
          "Learn how cloud platforms store and manage data.",
      },
      {
        title: "Cloud Security",
        description:
          "Understand the basic security concepts used in cloud environments.",
      },
      {
        title: "Cloud Deployment",
        description:
          "Learn the basics of deploying applications to cloud platforms.",
      },
    ],
  },
};

function Course() {
  const { id } = useParams();

  const course = courseData[id] || courseData[2];

  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState(course.progress);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // --------------------------------------------------
  // LOAD SAVED COURSE PROGRESS
  // --------------------------------------------------

  useEffect(() => {
    const storedUser = localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      setLoadingProgress(false);
      return;
    }

    const user = JSON.parse(storedUser);

    fetch(
      `https://careerbridge-backend-rw9x.onrender.com/api/course-progress/user/${user.id}/course/${id}`
    )
      .then((response) => {
        if (response.status === 404) {
          return null;
        }

        if (!response.ok) {
          throw new Error("Failed to load course progress");
        }

        return response.json();
      })
      .then((data) => {
        if (data) {
          setCurrentLesson(data.currentLesson);
          setProgress(data.progress);
        }
      })
      .catch((error) => {
        console.error("Error loading course progress:", error);
      })
      .finally(() => {
        setLoadingProgress(false);
      });
  }, [id]);

  // --------------------------------------------------
  // SAVE COURSE PROGRESS
  // --------------------------------------------------

  const saveProgress = (newProgress, newLesson) => {
    const storedUser = localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      return;
    }

    const user = JSON.parse(storedUser);

    fetch("https://careerbridge-backend-rw9x.onrender.com/api/course-progress/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        courseId: Number(id),
        progress: newProgress,
        currentLesson: newLesson,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save course progress");
        }

        return response.json();
      })
      .then(() => {
        console.log("Course progress saved");
      })
      .catch((error) => {
        console.error("Error saving course progress:", error);
      });
  };

  // --------------------------------------------------
  // SAFE LESSON INDEX
  // --------------------------------------------------

  const safeLessonIndex = Math.min(
    currentLesson,
    course.lessons.length - 1
  );

  const lesson = course.lessons[safeLessonIndex];

  // --------------------------------------------------
  // LESSON PROGRESS
  // --------------------------------------------------

  const lessonProgress = Math.round(
    (currentLesson / (course.lessons.length - 1)) * 100
  );

  const currentProgress = Math.max(
    progress,
    lessonProgress
  );

  // --------------------------------------------------
  // COMPLETED LESSONS
  // --------------------------------------------------

  const completedLessons = Math.floor(
    (currentProgress / 100) * course.lessons.length
  );

  // --------------------------------------------------
  // NEXT LESSON
  // --------------------------------------------------

  const handleNextLesson = () => {
    if (currentLesson < course.lessons.length - 1) {
      const nextLesson = currentLesson + 1;

      const newProgress = Math.round(
        (nextLesson / (course.lessons.length - 1)) * 100
      );

      setCurrentLesson(nextLesson);

      setProgress((previousProgress) => {
        const finalProgress = Math.max(
          previousProgress,
          newProgress
        );

        saveProgress(finalProgress, nextLesson);

        return finalProgress;
      });
    }
  };

  // --------------------------------------------------
  // PREVIOUS LESSON
  // --------------------------------------------------

  const handlePreviousLesson = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  // --------------------------------------------------
  // SELECT LESSON
  // --------------------------------------------------

  const handleLessonClick = (index) => {
    setCurrentLesson(index);

    const selectedProgress = Math.round(
      (index / (course.lessons.length - 1)) * 100
    );

    setProgress((previousProgress) => {
      const finalProgress = Math.max(
        previousProgress,
        selectedProgress
      );

      saveProgress(finalProgress, index);

      return finalProgress;
    });
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingProgress) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div className="dashboard-loading">
            Loading course...
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="dashboard-layout">

      {/* LEFT CAREERBRIDGE SIDEBAR */}

      <Sidebar />

      {/* MAIN COURSE AREA */}

      <main className="dashboard-main">

        <div className="course-page">

          {/* ------------------------------------------
              COURSE HEADER
          ------------------------------------------ */}

          <div className="course-header">

            <Link
              to="/learning"
              className="course-back"
            >
              ← Back to Learning
            </Link>

            <span className="course-label">
              COURSE
            </span>

            <h1>
              {course.title}
            </h1>

            <p>
              {course.description}
            </p>

          </div>

          {/* ------------------------------------------
              MAIN COURSE LAYOUT
          ------------------------------------------ */}

          <div className="course-layout">

            {/* ----------------------------------------
                LEFT COURSE CONTENT
            ---------------------------------------- */}

            <main className="course-content">

              {/* VIDEO */}

              <div className="course-video">

                <div className="play-button">
                  ▶
                </div>

                <span>
                  Course Video
                </span>

              </div>

              {/* LESSON CONTENT */}

              <div className="course-info">

                <span className="course-eyebrow">
                  LESSON {currentLesson + 1}
                </span>

                <h2>
                  {lesson.title}
                </h2>

                <p>
                  {lesson.description}
                </p>

                {/* LESSON ACTIONS */}

                <div className="lesson-actions">

                  <button
                    className="lesson-prev"
                    onClick={handlePreviousLesson}
                    disabled={currentLesson === 0}
                  >
                    ← Previous
                  </button>

                  <button
                    className="lesson-next"
                    onClick={handleNextLesson}
                    disabled={
                      currentLesson ===
                      course.lessons.length - 1
                    }
                  >
                    {currentLesson ===
                    course.lessons.length - 1
                      ? "Course Completed ✓"
                      : "Next Lesson →"}
                  </button>

                </div>

              </div>

            </main>

            {/* ----------------------------------------
                RIGHT COURSE SIDEBAR
            ---------------------------------------- */}

            <aside className="course-sidebar">

              <h3>
                Course Progress
              </h3>

              {/* PROGRESS BAR */}

              <div className="course-big-progress">

                <div
                  style={{
                    width: `${currentProgress}%`,
                  }}
                ></div>

              </div>

              <strong>
                {currentProgress}% Complete
              </strong>

              {/* LESSON LIST */}

              <div className="lesson-list">

                {course.lessons.map(
                  (item, index) => {

                    const isCompleted =
                      index < completedLessons;

                    const isActive =
                      index === safeLessonIndex;

                    return (
                      <button
                        key={index}
                        type="button"
                        className={`lesson ${
                          isActive
                            ? "active"
                            : ""
                        } ${
                          isCompleted
                            ? "completed"
                            : ""
                        }`}
                        onClick={() =>
                          handleLessonClick(index)
                        }
                      >

                        <span>
                          {isCompleted
                            ? "✓"
                            : index + 1}
                        </span>

                        <div className="lesson-title">
                          {item.title}
                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </aside>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Course;