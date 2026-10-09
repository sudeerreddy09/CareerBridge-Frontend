import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const totalCourses = 6;

const courseNames = {
  1: "Python for Data Science",
  2: "Machine Learning Fundamentals",
  3: "Data Structures & Algorithms",
  4: "React & Modern Frontend",
  5: "SQL & Database Essentials",
  6: "Cloud Computing Basics",
};

function Progress() {
  const [assessment, setAssessment] = useState(null);
  const [assessmentLoading, setAssessmentLoading] =
    useState(true);

  const [courseProgress, setCourseProgress] = useState({});
  const [progressLoading, setProgressLoading] =
    useState(true);

  // --------------------------------------------------
  // FETCH ASSESSMENT
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
  }, []);

  // --------------------------------------------------
  // FETCH COURSE PROGRESS
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

        for (let courseId = 1; courseId <= totalCourses; courseId++) {
          try {
            const response = await fetch(
              `http://localhost:8080/api/course-progress/user/${user.id}/course/${courseId}`
            );

            if (response.ok) {
              const data = await response.json();

              progressResults[courseId] =
                data.progress;
            } else if (response.status === 404) {
              progressResults[courseId] = 0;
            }
          } catch (error) {
            console.error(
              `Failed to fetch progress for course ${courseId}:`,
              error
            );

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
  }, []);

  // --------------------------------------------------
  // COURSE STATISTICS
  // --------------------------------------------------

  const courseProgressValues = Object.values(
    courseProgress
  );

  const completedCourses =
    courseProgressValues.filter(
      (progress) => progress >= 100
    ).length;

  const coursesStarted =
    courseProgressValues.filter(
      (progress) => progress > 0
    ).length;

  const averageCourseProgress =
    courseProgressValues.length > 0
      ? Math.round(
          courseProgressValues.reduce(
            (total, progress) =>
              total + progress,
            0
          ) / totalCourses
        )
      : 0;

  const remainingCourses =
    totalCourses - completedCourses;

  // --------------------------------------------------
  // CAREER SCORE
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
    : "AI / ML Engineer";

  // --------------------------------------------------
  // SKILLS DEVELOPED
  // --------------------------------------------------

  const skillsDeveloped = Math.min(
    completedCourses * 2,
    12
  );

  const remainingSkills =
    Math.max(12 - skillsDeveloped, 0);

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <Sidebar/>  


      {/* MAIN */}

      <main className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <span>⌕</span>

            <input
              placeholder="Search your career journey..."
            />

          </div>

          <div className="dashboard-top-actions">

            <button className="notification-button">
              ♧
              <span />
            </button>

            <div className="dashboard-avatar">
              U
            </div>

          </div>

        </header>


        {/* CONTENT */}

        <div className="progress-content">

          {/* HEADING */}

          <div className="progress-heading">

            <div>

              <span className="dashboard-eyebrow">
                YOUR JOURNEY
              </span>

              <h1>
                Your Progress
              </h1>

              <p>
                Track your learning, skills and career
                growth in one place.
              </p>

            </div>

            <Link
              to="/learning"
              className="progress-action"
            >
              Continue Learning →
            </Link>

          </div>


          {/* OVERVIEW CARDS */}

          <section className="progress-overview">

            {/* CAREER PROGRESS */}

            <div className="progress-stat-card">

              <div className="progress-stat-icon">
                ◒
              </div>

              <div>

                <span>
                  CAREER PROGRESS
                </span>

                <strong>
                  {assessmentLoading
                    ? "..."
                    : `${careerProgress}%`}
                </strong>

              </div>

              <small>
                Based on assessment
              </small>

            </div>


            {/* SKILLS */}

            <div className="progress-stat-card">

              <div className="progress-stat-icon">
                ◈
              </div>

              <div>

                <span>
                  SKILLS DEVELOPED
                </span>

                <strong>
                  {progressLoading
                    ? "..."
                    : `${skillsDeveloped} / 12`}
                </strong>

              </div>

              <small>
                {progressLoading
                  ? "Loading..."
                  : `${remainingSkills} skills remaining`}
              </small>

            </div>


            {/* COURSES */}

            <div className="progress-stat-card">

              <div className="progress-stat-icon">
                ▣
              </div>

              <div>

                <span>
                  COURSES COMPLETED
                </span>

                <strong>
                  {progressLoading
                    ? "..."
                    : completedCourses}
                </strong>

              </div>

              <small>
                {progressLoading
                  ? "Loading..."
                  : `${coursesStarted} courses started`}
              </small>

            </div>


            {/* LEARNING PROGRESS */}

            <div className="progress-stat-card">

              <div className="progress-stat-icon">
                ★
              </div>

              <div>

                <span>
                  LEARNING PROGRESS
                </span>

                <strong>
                  {progressLoading
                    ? "..."
                    : `${averageCourseProgress}%`}
                </strong>

              </div>

              <small>
                Across {totalCourses} courses
              </small>

            </div>

          </section>


          {/* MAIN GRID */}

          <section className="progress-grid">

            {/* CAREER PROGRESS */}

            <div className="progress-card career-progress-card">

              <div className="progress-card-heading">

                <div>

                  <span>
                    CAREER DEVELOPMENT
                  </span>

                  <h2>
                    Career Progress
                  </h2>

                </div>

                <button>
                  This Year ▾
                </button>

              </div>


              <div className="career-progress-body">

                <div className="progress-circle">

                  <div>

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


                <div className="progress-milestones">

                  {/* ASSESSMENT */}

                  <div
                    className={`milestone ${
                      assessment
                        ? "completed"
                        : "active"
                    }`}
                  >

                    <span>
                      {assessment
                        ? "✓"
                        : "1"}
                    </span>

                    <div>

                      <strong>
                        Career Assessment
                      </strong>

                      <small>
                        {assessment
                          ? "Completed"
                          : "Not completed"}
                      </small>

                    </div>

                  </div>


                  {/* LEARNING */}

                  <div
                    className={`milestone ${
                      averageCourseProgress >= 50
                        ? "completed"
                        : "active"
                    }`}
                  >

                    <span>
                      {averageCourseProgress >= 50
                        ? "✓"
                        : "2"}
                    </span>

                    <div>

                      <strong>
                        Skill Development
                      </strong>

                      <small>
                        {completedCourses} of{" "}
                        {totalCourses} courses completed
                      </small>

                    </div>

                  </div>


                  {/* PORTFOLIO */}

                  <div className="milestone active">

                    <span>
                      3
                    </span>

                    <div>

                      <strong>
                        Build Portfolio
                      </strong>

                      <small>
                        In progress
                      </small>

                    </div>

                  </div>


                  {/* JOB PREPARATION */}

                  <div className="milestone">

                    <span>
                      4
                    </span>

                    <div>

                      <strong>
                        Job Preparation
                      </strong>

                      <small>
                        Not started
                      </small>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* WEEKLY ACTIVITY */}

            <div className="progress-card">

              <div className="progress-card-heading">

                <div>

                  <span>
                    LEARNING ACTIVITY
                  </span>

                  <h2>
                    Weekly Activity
                  </h2>

                </div>

                <span className="activity-total">
                  12h 40m
                </span>

              </div>


              <div className="activity-chart">

                <div className="chart-bars">

                  <div>
                    <span
                      style={{
                        height: "45%",
                      }}
                    />
                    <small>Mon</small>
                  </div>

                  <div>
                    <span
                      style={{
                        height: "70%",
                      }}
                    />
                    <small>Tue</small>
                  </div>

                  <div>
                    <span
                      style={{
                        height: "55%",
                      }}
                    />
                    <small>Wed</small>
                  </div>

                  <div>
                    <span
                      style={{
                        height: "85%",
                      }}
                    />
                    <small>Thu</small>
                  </div>

                  <div>
                    <span
                      style={{
                        height: "65%",
                      }}
                    />
                    <small>Fri</small>
                  </div>

                  <div>
                    <span
                      style={{
                        height: "95%",
                      }}
                    />
                    <small>Sat</small>
                  </div>

                  <div>
                    <span
                      style={{
                        height: "40%",
                      }}
                    />
                    <small>Sun</small>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* SKILLS */}

          <section className="progress-card skills-progress-card">

            <div className="progress-card-heading">

              <div>

                <span>
                  SKILL DEVELOPMENT
                </span>

                <h2>
                  Your Skills
                </h2>

              </div>

              <Link to="/assessment">
                Improve Skills →
              </Link>

            </div>


            <div className="skills-progress-list">

              <div className="skill-progress-row">

                <div className="skill-name">

                  <strong>
                    Python
                  </strong>

                  <span>
                    Advanced
                  </span>

                </div>

                <div className="skill-progress-track">
                  <span
                    style={{
                      width: "90%",
                    }}
                  />
                </div>

                <strong>
                  90%
                </strong>

              </div>


              <div className="skill-progress-row">

                <div className="skill-name">

                  <strong>
                    Machine Learning
                  </strong>

                  <span>
                    Intermediate
                  </span>

                </div>

                <div className="skill-progress-track">
                  <span
                    style={{
                      width: "82%",
                    }}
                  />
                </div>

                <strong>
                  82%
                </strong>

              </div>


              <div className="skill-progress-row">

                <div className="skill-name">

                  <strong>
                    SQL
                  </strong>

                  <span>
                    Intermediate
                  </span>

                </div>

                <div className="skill-progress-track">
                  <span
                    style={{
                      width: "76%",
                    }}
                  />
                </div>

                <strong>
                  76%
                </strong>

              </div>


              <div className="skill-progress-row">

                <div className="skill-name">

                  <strong>
                    React
                  </strong>

                  <span>
                    Intermediate
                  </span>

                </div>

                <div className="skill-progress-track">
                  <span
                    style={{
                      width: "70%",
                    }}
                  />
                </div>

                <strong>
                  70%
                </strong>

              </div>


              <div className="skill-progress-row">

                <div className="skill-name">

                  <strong>
                    Data Visualization
                  </strong>

                  <span>
                    Beginner
                  </span>

                </div>

                <div className="skill-progress-track">
                  <span
                    style={{
                      width: "48%",
                    }}
                  />
                </div>

                <strong>
                  48%
                </strong>

              </div>

            </div>

          </section>


          {/* RECENT ACHIEVEMENTS */}

          <section className="progress-bottom-grid">

            <div className="progress-card">

              <div className="progress-card-heading">

                <div>

                  <span>
                    ACHIEVEMENTS
                  </span>

                  <h2>
                    Recent Achievements
                  </h2>

                </div>

              </div>


              <div className="achievement-list">

                <div className="achievement">

                  <div>
                    🏆
                  </div>

                  <div>

                    <strong>
                      ML Fundamentals Completed
                    </strong>

                    <span>
                      Course completion milestone
                    </span>

                  </div>

                </div>


                <div className="achievement">

                  <div>
                    🔥
                  </div>

                  <div>

                    <strong>
                      Learning Progress
                    </strong>

                    <span>
                      Keep building your skills
                    </span>

                  </div>

                </div>


                <div className="achievement">

                  <div>
                    ⚡
                  </div>

                  <div>

                    <strong>
                      Course Milestone
                    </strong>

                    <span>
                      {completedCourses} courses completed
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* NEXT STEP */}

            <div className="progress-card next-step-card">

              <span>
                NEXT STEP
              </span>

              <h2>
                Build your portfolio
              </h2>

              <p>
                Complete two more projects to
                strengthen your{" "}
                {assessmentLoading
                  ? "career"
                  : recommendedCareer}{" "}
                profile.
              </p>

              <Link to="/learning">
                Explore Projects →
              </Link>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Progress;