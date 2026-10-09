import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] =
    useState(true);

  const [courseProgress, setCourseProgress] = useState({});
  const [progressLoading, setProgressLoading] =
    useState(true);

  const [unreadNotifications, setUnreadNotifications] =
    useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const totalCourses = 6;

  const storedUser =
    localStorage.getItem("careerbridgeUser");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userName = user?.name || "Career Explorer";

  // --------------------------------------------------
  // SEARCH DATA
  // --------------------------------------------------

  const searchItems = [
    {
      title: "Career Assessment",
      description:
        "Discover careers that match your skills and interests.",
      category: "Career",
      path: "/assessment",
      keywords:
        "assessment career test skills interests recommendation",
    },
    {
      title: "Learning",
      description:
        "Explore courses and continue building your skills.",
      category: "Learning",
      path: "/learning",
      keywords:
        "learning courses study education skills",
    },
    {
      title: "Python for Data Science",
      description:
        "Learn Python fundamentals for data science.",
      category: "Course",
      path: "/learning/course/1",
      keywords:
        "python data science programming course",
    },
    {
      title: "Machine Learning Fundamentals",
      description:
        "Build your foundation in machine learning.",
      category: "Course",
      path: "/learning/course/2",
      keywords:
        "machine learning ml ai artificial intelligence course",
    },
    {
      title: "Data Structures & Algorithms",
      description:
        "Strengthen your programming and problem-solving skills.",
      category: "Course",
      path: "/learning/course/3",
      keywords:
        "data structures algorithms dsa programming course",
    },
    {
      title: "Jobs",
      description:
        "Find personalized job opportunities.",
      category: "Jobs",
      path: "/jobs",
      keywords:
        "jobs opportunities employment careers hiring",
    },
    {
      title: "Machine Learning Engineer",
      description:
        "AI & ML opportunity in Hyderabad.",
      category: "Job",
      path: "/jobs/1",
      keywords:
        "machine learning engineer technova hyderabad ai ml",
    },
    {
      title: "Data Scientist",
      description:
        "Data science opportunity in Bengaluru.",
      category: "Job",
      path: "/jobs/2",
      keywords:
        "data scientist datacore bengaluru data science",
    },
    {
      title: "Software Engineer",
      description:
        "Software development opportunity in Hyderabad.",
      category: "Job",
      path: "/jobs/3",
      keywords:
        "software engineer codeworks hyderabad software development",
    },
    {
      title: "AI Engineer",
      description:
        "AI engineering opportunity in Pune.",
      category: "Job",
      path: "/jobs/4",
      keywords:
        "ai engineer innovateai pune artificial intelligence",
    },
    {
      title: "Backend Developer",
      description:
        "Backend development opportunity in Chennai.",
      category: "Job",
      path: "/jobs/5",
      keywords:
        "backend developer cloudstack chennai software",
    },
    {
      title: "Junior Data Analyst",
      description:
        "Data analytics opportunity in Hyderabad.",
      category: "Job",
      path: "/jobs/6",
      keywords:
        "junior data analyst insightlabs hyderabad analytics",
    },
    {
      title: "Saved Jobs",
      description:
        "View the jobs you saved for later.",
      category: "Jobs",
      path: "/saved-jobs",
      keywords:
        "saved jobs bookmarks favorites",
    },
    {
      title: "Applications",
      description:
        "Track your job applications and statuses.",
      category: "Applications",
      path: "/applications",
      keywords:
        "applications applied jobs status interview selected rejected",
    },
    {
      title: "Progress",
      description:
        "Track your overall career and learning progress.",
      category: "Progress",
      path: "/progress",
      keywords:
        "progress career learning skills completion",
    },
    {
      title: "Profile",
      description:
        "Manage your CareerBridge profile.",
      category: "Account",
      path: "/profile",
      keywords:
        "profile account personal information",
    },
    {
      title: "Portfolio",
      description:
        "Build and showcase your professional portfolio.",
      category: "Account",
      path: "/portfolio",
      keywords:
        "portfolio projects resume skills showcase",
    },
    {
      title: "Notifications",
      description:
        "View your latest CareerBridge updates.",
      category: "Updates",
      path: "/notifications",
      keywords:
        "notifications alerts updates messages",
    },
  ];

  const normalizedSearch =
    searchQuery.trim().toLowerCase();

  const searchResults =
    normalizedSearch.length === 0
      ? []
      : searchItems
          .filter((item) => {
            const searchableText =
              `${item.title} ${item.description} ${item.category} ${item.keywords}`
                .toLowerCase();

            return searchableText.includes(
              normalizedSearch
            );
          })
          .slice(0, 7);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchResult = (path) => {
    setSearchQuery("");
    navigate(path);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setSearchQuery("");
      return;
    }

    if (
      event.key === "Enter" &&
      searchResults.length > 0
    ) {
      handleSearchResult(
        searchResults[0].path
      );
    }
  };

  // --------------------------------------------------
  // FETCH ASSESSMENT
  // --------------------------------------------------

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!user?.id) {
        setAssessmentLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/assessment/user/${user.id}`
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
  }, [user?.id]);

  // --------------------------------------------------
  // FETCH COURSE PROGRESS
  // --------------------------------------------------

  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!user?.id) {
        setProgressLoading(false);
        return;
      }

      try {
        const progressResults = {};

        for (
          let courseId = 1;
          courseId <= totalCourses;
          courseId++
        ) {
          const response = await fetch(
            `http://localhost:8080/api/course-progress/user/${user.id}/course/${courseId}`
          );

          if (response.ok) {
            const data = await response.json();

            progressResults[courseId] =
              data.progress;
          } else {
            progressResults[courseId] = 0;
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
  }, [user?.id]);

  // --------------------------------------------------
  // FETCH UNREAD NOTIFICATIONS
  // --------------------------------------------------

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      if (!user?.id) {
        setUnreadNotifications(0);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/notifications/user/${user.id}/unread-count`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch notification count"
          );
        }

        const count = await response.json();

        setUnreadNotifications(count);
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );
      }
    };

    fetchUnreadNotifications();

    const handleNotificationsUpdated = () => {
      fetchUnreadNotifications();
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationsUpdated
    );

    const interval = setInterval(
      fetchUnreadNotifications,
      30000
    );

    return () => {
      clearInterval(interval);

      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationsUpdated
      );
    };
  }, [user?.id]);

  // --------------------------------------------------
  // COURSE CALCULATIONS
  // --------------------------------------------------

  const courseProgressValues = Array.from(
    { length: totalCourses },
    (_, index) =>
      courseProgress[index + 1] || 0
  );

  const completedCourses =
    courseProgressValues.filter(
      (progress) => progress >= 100
    ).length;

  const startedCourses =
    courseProgressValues.filter(
      (progress) => progress > 0
    ).length;

  const inProgressCourses =
    courseProgressValues.filter(
      (progress) =>
        progress > 0 && progress < 100
    ).length;

  const averageCourseProgress = Math.round(
    courseProgressValues.reduce(
      (total, progress) =>
        total + progress,
      0
    ) / totalCourses
  );

  // --------------------------------------------------
  // CAREER PROGRESS
  // --------------------------------------------------

  const careerProgress = assessment
    ? Math.round(
        (
          assessment.aiMlScore +
          assessment.dataScientistScore +
          assessment.softwareEngineerScore
        ) / 3
      )
    : 0;

  // --------------------------------------------------
  // SKILL DEVELOPMENT
  // --------------------------------------------------

  const skillDevelopment = Math.min(
    completedCourses * 2,
    12
  );

  const remainingSkills = Math.max(
    12 - skillDevelopment,
    0
  );

  return (
    <div className="dashboard-page">

      <Sidebar />

      <main className="dashboard-main">

        {/* TOP BAR */}

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <span>⌕</span>

            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search careers, courses, jobs..."
              aria-label="Search CareerBridge"
            />

            {searchQuery.trim() && (
              <button
                type="button"
                className="dashboard-search-clear"
                onClick={() =>
                  setSearchQuery("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}

            {normalizedSearch.length > 0 && (
              <div className="dashboard-search-results">

                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <button
                      type="button"
                      key={`${item.category}-${item.path}`}
                      className="dashboard-search-result"
                      onClick={() =>
                        handleSearchResult(
                          item.path
                        )
                      }
                    >

                      <div className="search-result-icon">
                        {item.category ===
                        "Course"
                          ? "▣"
                          : item.category ===
                            "Job"
                          ? "⌕"
                          : item.category ===
                            "Applications"
                          ? "▤"
                          : item.category ===
                            "Account"
                          ? "◎"
                          : item.category ===
                            "Updates"
                          ? "♢"
                          : "↗"}
                      </div>

                      <div className="search-result-content">

                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.description}
                        </span>

                      </div>

                      <span className="search-result-category">
                        {item.category}
                      </span>

                    </button>
                  ))
                ) : (
                  <div className="dashboard-search-no-results">

                    <strong>
                      No results found
                    </strong>

                    <span>
                      Try searching for a job,
                      course, assessment or
                      portfolio.
                    </span>

                  </div>
                )}

              </div>
            )}

          </div>

          <div className="dashboard-top-actions">

            <button
              className="notification-button"
              onClick={() =>
                navigate("/notifications")
              }
              aria-label="Open notifications"
            >

              <span className="notification-bell">
                ♢
              </span>

              {unreadNotifications > 0 && (
                <span className="notification-button-badge">
                  {unreadNotifications > 99
                    ? "99+"
                    : unreadNotifications}
                </span>
              )}

            </button>

            <Link
              to="/profile"
              className="dashboard-user"
            >

              <div className="user-avatar">
                {userName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="dashboard-user-info">

                <strong>
                  {userName}
                </strong>

                <small>
                  Career Explorer
                </small>

              </div>

            </Link>

          </div>

        </header>

        {/* CONTENT */}

        <div className="dashboard-content">

          {/* WELCOME */}

          <section className="dashboard-welcome">

            <div>

              <span className="dashboard-eyebrow">
                YOUR CAREER JOURNEY
              </span>

              <h1>
                Welcome back,{" "}
                {userName.split(" ")[0]}.
              </h1>

              <p>
                Keep building your skills. Your next
                opportunity is closer than you think.
              </p>

            </div>

            <Link
              to="/assessment"
              className="dashboard-primary-button"
            >
              Take Career Assessment
              <span>→</span>
            </Link>

          </section>

          {/* STATS */}

          <section className="dashboard-stats">

            <div className="dashboard-stat-card">

              <div className="stat-icon">
                ↗
              </div>

              <div>

                <span>
                  Career Progress
                </span>

                <strong>
                  {assessmentLoading
                    ? "..."
                    : `${careerProgress}%`}
                </strong>

              </div>

              <small>
                +8% this month
              </small>

            </div>

            <div className="dashboard-stat-card">

              <div className="stat-icon">
                ◇
              </div>

              <div>

                <span>
                  Skills Developed
                </span>

                <strong>
                  {progressLoading
                    ? "..."
                    : `${skillDevelopment} / 12`}
                </strong>

              </div>

              <small>
                {progressLoading
                  ? "..."
                  : `${remainingSkills} skills remaining`}
              </small>

            </div>

            <div className="dashboard-stat-card">

              <div className="stat-icon">
                ▣
              </div>

              <div>

                <span>
                  Courses Completed
                </span>

                <strong>
                  {progressLoading
                    ? "..."
                    : completedCourses}
                </strong>

              </div>

              <small>
                {progressLoading
                  ? "..."
                  : `${inProgressCourses} in progress`}
              </small>

            </div>

            <div className="dashboard-stat-card">

              <div className="stat-icon">
                ♧
              </div>

              <div>

                <span>
                  Job Matches
                </span>

                <strong>
                  24
                </strong>

              </div>

              <small>
                6 new this week
              </small>

            </div>

          </section>

          {/* MAIN GRID */}

          <section className="dashboard-grid">

            {/* CAREER OVERVIEW */}

            <div className="dashboard-card career-progress-card">

              <div className="card-heading">

                <div>

                  <span>
                    CAREER OVERVIEW
                  </span>

                  <h2>
                    Your career progress
                  </h2>

                </div>

                <Link to="/progress">
                  View details →
                </Link>

              </div>

              <div className="career-progress-body">

                <div className="progress-circle">

                  <div className="progress-circle-inner">

                    <strong>
                      {assessmentLoading
                        ? "..."
                        : `${careerProgress}%`}
                    </strong>

                    <span>
                      Complete
                    </span>

                  </div>

                </div>

                <div className="progress-details">

                  <div className="progress-item">

                    <div>

                      <span>
                        Career Assessment
                      </span>

                      <strong>
                        {assessmentLoading
                          ? "..."
                          : assessment
                          ? `${Math.max(
                              assessment.aiMlScore,
                              assessment.dataScientistScore,
                              assessment.softwareEngineerScore
                            )}%`
                          : "0%"}
                      </strong>

                    </div>

                    <div className="mini-progress">

                      <div
                        style={{
                          width: `${
                            assessment
                              ? Math.max(
                                  assessment.aiMlScore,
                                  assessment.dataScientistScore,
                                  assessment.softwareEngineerScore
                                )
                              : 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="progress-item">

                    <div>

                      <span>
                        Skills
                      </span>

                      <strong>
                        {progressLoading
                          ? "..."
                          : `${Math.round(
                              (completedCourses /
                                totalCourses) *
                                100
                            )}%`}
                      </strong>

                    </div>

                    <div className="mini-progress">

                      <div
                        style={{
                          width: `${
                            progressLoading
                              ? 0
                              : Math.round(
                                  (completedCourses /
                                    totalCourses) *
                                    100
                                )
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="progress-item">

                    <div>

                      <span>
                        Learning
                      </span>

                      <strong>
                        {progressLoading
                          ? "..."
                          : `${averageCourseProgress}%`}
                      </strong>

                    </div>

                    <div className="mini-progress">

                      <div
                        style={{
                          width: `${
                            progressLoading
                              ? 0
                              : averageCourseProgress
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <div className="progress-item">

                    <div>

                      <span>
                        Job Readiness
                      </span>

                      <strong>
                        58%
                      </strong>

                    </div>

                    <div className="mini-progress">

                      <div
                        style={{
                          width: "58%",
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* AI RECOMMENDATION */}

            <div className="dashboard-card ai-card">

              <div className="ai-badge">
                ✦ AI CAREER GUIDE
              </div>

              <h2>
                Your recommended
                <br />
                career path
              </h2>

              <p>
                Based on your skills, interests and
                learning activity.
              </p>

              <div className="ai-career">

                <div className="ai-career-icon">
                  AI
                </div>

                <div>

                  <strong>

                    {assessment

                      ? assessment.softwareEngineerScore >=
                          assessment.aiMlScore &&
                        assessment.softwareEngineerScore >=
                          assessment.dataScientistScore
                        ? "Software Engineer"

                        : assessment.aiMlScore >=
                          assessment.dataScientistScore
                        ? "AI / ML Engineer"

                        : "Data Scientist"

                      : "AI / ML Engineer"}

                  </strong>

                  <span>

                    {assessment
                      ? Math.max(
                          assessment.aiMlScore,
                          assessment.dataScientistScore,
                          assessment.softwareEngineerScore
                        )
                      : 0}

                    % skill alignment

                  </span>

                </div>

              </div>

              <Link
                to="/assessment"
                className="ai-button"
              >
                Explore career path →
              </Link>

            </div>

            {/* CONTINUE LEARNING */}

            <div className="dashboard-card learning-card">

              <div className="card-heading">

                <div>

                  <span>
                    KEEP LEARNING
                  </span>

                  <h2>
                    Continue learning
                  </h2>

                </div>

                <Link to="/learning">
                  View all →
                </Link>

              </div>

              <div className="course-list">

                <Link
                  to="/learning/course/1"
                  className="course-item"
                >

                  <div className="course-icon">
                    PY
                  </div>

                  <div className="course-info">

                    <strong>
                      Python for Data Science
                    </strong>

                    <span>
                      {progressLoading
                        ? "Loading progress..."
                        : `${courseProgress[1] || 0}% complete`}
                    </span>

                    <div className="course-progress">

                      <div
                        style={{
                          width: `${
                            courseProgress[1] || 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <span className="course-arrow">
                    →
                  </span>

                </Link>

                <Link
                  to="/learning/course/2"
                  className="course-item"
                >

                  <div className="course-icon">
                    ML
                  </div>

                  <div className="course-info">

                    <strong>
                      Machine Learning Fundamentals
                    </strong>

                    <span>
                      {progressLoading
                        ? "Loading progress..."
                        : `${courseProgress[2] || 0}% complete`}
                    </span>

                    <div className="course-progress">

                      <div
                        style={{
                          width: `${
                            courseProgress[2] || 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <span className="course-arrow">
                    →
                  </span>

                </Link>

                <Link
                  to="/learning/course/3"
                  className="course-item"
                >

                  <div className="course-icon">
                    DS
                  </div>

                  <div className="course-info">

                    <strong>
                      Data Structures & Algorithms
                    </strong>

                    <span>
                      {progressLoading
                        ? "Loading progress..."
                        : `${courseProgress[3] || 0}% complete`}
                    </span>

                    <div className="course-progress">

                      <div
                        style={{
                          width: `${
                            courseProgress[3] || 0
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <span className="course-arrow">
                    →
                  </span>

                </Link>

              </div>

            </div>

            {/* RECOMMENDED JOBS */}

            <div className="dashboard-card jobs-card">

              <div className="card-heading">

                <div>

                  <span>
                    OPPORTUNITIES
                  </span>

                  <h2>
                    Recommended jobs
                  </h2>

                </div>

                <Link to="/jobs">
                  View jobs →
                </Link>

              </div>

              <div className="job-list">

                <Link
                  to="/jobs/1"
                  className="job-item"
                >

                  <div className="company-logo">
                    TCS
                  </div>

                  <div className="job-info">

                    <strong>
                      Graduate Software Engineer
                    </strong>

                    <span>
                      Technology · Hyderabad
                    </span>

                  </div>

                  <span className="job-match">
                    94%
                  </span>

                  <span className="job-arrow">
                    →
                  </span>

                </Link>

                <Link
                  to="/jobs/2"
                  className="job-item"
                >

                  <div className="company-logo">
                    INF
                  </div>

                  <div className="job-info">

                    <strong>
                      AI / ML Engineer
                    </strong>

                    <span>
                      Artificial Intelligence · Bengaluru
                    </span>

                  </div>

                  <span className="job-match">
                    89%
                  </span>

                  <span className="job-arrow">
                    →
                  </span>

                </Link>

                <Link
                  to="/jobs/3"
                  className="job-item"
                >

                  <div className="company-logo">
                    ACC
                  </div>

                  <div className="job-info">

                    <strong>
                      Data Analyst
                    </strong>

                    <span>
                      Analytics · Hyderabad
                    </span>

                  </div>

                  <span className="job-match">
                    86%
                  </span>

                  <span className="job-arrow">
                    →
                  </span>

                </Link>

              </div>

            </div>

          </section>

          {/* BOTTOM CTA */}

          <section className="dashboard-bottom-cta">

            <div>

              <span>
                NEXT STEP
              </span>

              <h2>
                {assessment
                  ? completedCourses >= totalCourses
                    ? "Start your job search."
                    : completedCourses >= 4
                    ? "Build your portfolio."
                    : startedCourses > 0
                    ? "Continue building your skills."
                    : "Discover what you're capable of."
                  : "Discover what you're capable of."}
              </h2>

              <p>
                {assessment
                  ? completedCourses >= totalCourses
                    ? "Your learning journey is complete. Start exploring jobs that match your career goals."
                    : completedCourses >= 4
                    ? "You've built a strong foundation. Showcase your skills by building a professional portfolio."
                    : startedCourses > 0
                    ? "Keep learning and complete more courses to strengthen your career profile."
                    : "Complete your career assessment to unlock personalized career recommendations."
                  : "Complete your career assessment to unlock personalized career recommendations."}
              </p>

            </div>

            <Link
              to={
                !assessment
                  ? "/assessment"
                  : completedCourses >= totalCourses
                  ? "/jobs"
                  : completedCourses >= 4
                  ? "/profile"
                  : "/learning"
              }
              className="dashboard-cta-button"
            >
              {!assessment
                ? "Start Assessment →"
                : completedCourses >= totalCourses
                ? "Explore Jobs →"
                : completedCourses >= 4
                ? "Build Portfolio →"
                : "Continue Learning →"}
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;