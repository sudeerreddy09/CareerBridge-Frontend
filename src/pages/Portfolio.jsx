import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Portfolio() {
  const storedUser =
    localStorage.getItem("careerbridgeUser");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userName =
    user?.name || "Career Explorer";

  const [assessment, setAssessment] =
    useState(null);

  const [courseProgress, setCourseProgress] =
    useState({});

  const [education, setEducation] =
    useState({
      degree: "",
      college: "",
      branch: "",
      graduationYear: "",
      cgpa: "",
    });

  const [portfolio, setPortfolio] = useState({
    careerGoal: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    skills: "",
    projects: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [showResume, setShowResume] =
    useState(false);

  const totalCourses = 6;

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {

        // =================================================
        // LOAD PROFILE / EDUCATION
        // =================================================

        const profileResponse =
          await fetch(
            `https://careerbridge-backend-rw9x.onrender.com/api/profile/user/${user.id}`
          );

        if (profileResponse.ok) {
          const profileData =
            await profileResponse.json();

          setEducation({
            degree:
              profileData.degree || "",
            college:
              profileData.college || "",
            branch:
              profileData.branch || "",
            graduationYear:
              profileData.graduationYear || "",
            cgpa:
              profileData.cgpa || "",
          });
        }

        // =================================================
        // LOAD PORTFOLIO
        // =================================================

        const portfolioResponse =
          await fetch(
            `https://careerbridge-backend-rw9x.onrender.com/api/portfolio/user/${user.id}`
          );

        if (portfolioResponse.ok) {
          const portfolioData =
            await portfolioResponse.json();

          setPortfolio({
            careerGoal:
              portfolioData.careerGoal || "",
            bio:
              portfolioData.bio || "",
            githubUrl:
              portfolioData.githubUrl || "",
            linkedinUrl:
              portfolioData.linkedinUrl || "",
            skills:
              portfolioData.skills || "",
            projects:
              portfolioData.projects || "",
          });
        }

        // =================================================
        // LOAD ASSESSMENT
        // =================================================

        const assessmentResponse =
          await fetch(
            `https://careerbridge-backend-rw9x.onrender.com/api/assessment/user/${user.id}`
          );

        if (assessmentResponse.ok) {
          const assessmentData =
            await assessmentResponse.json();

          setAssessment(
            assessmentData
          );
        }

        // =================================================
        // LOAD COURSE PROGRESS
        // =================================================

        const progressData = {};

        for (
          let courseId = 1;
          courseId <= totalCourses;
          courseId++
        ) {
          const response =
            await fetch(
              `https://careerbridge-backend-rw9x.onrender.com/api/course-progress/user/${user.id}/course/${courseId}`
            );

          if (response.ok) {
            const data =
              await response.json();

            progressData[courseId] =
              data.progress;
          } else {
            progressData[courseId] = 0;
          }
        }

        setCourseProgress(
          progressData
        );

      } catch (error) {
        console.error(
          "Failed to load portfolio:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // =====================================================
  // COURSE DATA
  // =====================================================

  const courseNames = [
    "Python for Data Science",
    "Machine Learning Fundamentals",
    "Data Structures & Algorithms",
    "Computer Vision",
    "Data Visualization",
    "Career & Interview Preparation",
  ];

  const completedCourses =
    courseNames.filter(
      (_, index) =>
        (courseProgress[index + 1] || 0) >=
        100
    );

  // =====================================================
  // CAREER ASSESSMENT
  // =====================================================

  const careerScores = assessment
    ? {
        "AI / ML Engineer":
          assessment.aiMlScore,

        "Data Scientist":
          assessment.dataScientistScore,

        "Software Engineer":
          assessment.softwareEngineerScore,
      }
    : {};

  const recommendedCareer =
    assessment
      ? Object.entries(
          careerScores
        ).sort(
          (a, b) => b[1] - a[1]
        )[0]
      : null;

  // =====================================================
  // SKILLS
  // =====================================================

  const defaultSkills = [
    "Python",
    "Machine Learning",
    "Data Structures",
    "Problem Solving",
    "Data Analysis",
    "Artificial Intelligence",
  ];

  const skillsList = portfolio.skills
    ? portfolio.skills
        .split(",")
        .map((skill) =>
          skill.trim()
        )
        .filter(Boolean)
    : defaultSkills;

  // =====================================================
  // SAVE PORTFOLIO
  // =====================================================

  const handleSave = async () => {
    if (!user?.id) {
      setMessage(
        "Please login first."
      );

      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          "https://careerbridge-backend-rw9x.onrender.com/api/portfolio/save",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId: user.id,
              careerGoal:
                portfolio.careerGoal,
              bio:
                portfolio.bio,
              githubUrl:
                portfolio.githubUrl,
              linkedinUrl:
                portfolio.linkedinUrl,
              skills:
                portfolio.skills,
              projects:
                portfolio.projects,
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to save portfolio"
        );
      }

      const savedPortfolio =
        await response.json();

      setPortfolio({
        careerGoal:
          savedPortfolio.careerGoal ||
          "",
        bio:
          savedPortfolio.bio || "",
        githubUrl:
          savedPortfolio.githubUrl ||
          "",
        linkedinUrl:
          savedPortfolio.linkedinUrl ||
          "",
        skills:
          savedPortfolio.skills ||
          "",
        projects:
          savedPortfolio.projects ||
          "",
      });

      setEditing(false);

      setMessage(
        "Portfolio saved successfully."
      );

    } catch (error) {
      console.error(
        "Save portfolio error:",
        error
      );

      setMessage(
        "Failed to save portfolio."
      );

    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setPortfolio(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // PRINT RESUME
  // =====================================================

  const handlePrintResume = () => {
    window.print();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-page">

        <main className="dashboard-main">

          <div className="portfolio-loading">
            Loading portfolio...
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="dashboard-sidebar">

        <Link
          to="/"
          className="dashboard-brand"
        >
          <div className="brand-mark">
            C
          </div>

          <div className="brand-text">
            <span>Career</span>Bridge
          </div>
        </Link>

        <div className="sidebar-section">

          <p className="sidebar-label">
            WORKSPACE
          </p>

          <Link
            to="/dashboard"
            className="sidebar-link"
          >
            <span>⌂</span>
            Dashboard
          </Link>

          <Link
            to="/assessment"
            className="sidebar-link"
          >
            <span>◈</span>
            Career Assessment
          </Link>

          <Link
            to="/learning"
            className="sidebar-link"
          >
            <span>▣</span>
            Learning
          </Link>

          <Link
            to="/jobs"
            className="sidebar-link"
          >
            <span>⌕</span>
            Jobs
          </Link>

          <Link
            to="/saved-jobs"
            className="sidebar-link"
          >
            <span>♥</span>
            Saved Jobs
          </Link>

          <Link
            to="/applications"
            className="sidebar-link"
          >
            <span>▤</span>
            Applications
          </Link>

          <Link
            to="/progress"
            className="sidebar-link"
          >
            <span>↗</span>
            Progress
          </Link>

        </div>

        <div className="sidebar-section">

          <p className="sidebar-label">
            ACCOUNT
          </p>

          <Link
            to="/profile"
            className="sidebar-link"
          >
            <span>◎</span>
            Profile
          </Link>

          <Link
            to="/portfolio"
            className="sidebar-link active"
          >
            <span>▣</span>
            Portfolio
          </Link>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search careers, courses, jobs..."
            />

          </div>

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

        </header>

        <div className="dashboard-content portfolio-page">

          {/* =================================================
              PORTFOLIO HERO
          ================================================= */}

          <section className="portfolio-hero">

            <div className="portfolio-hero-content">

              <div className="portfolio-eyebrow">
                PROFESSIONAL PORTFOLIO
              </div>

              <h1>
                {userName}
              </h1>

              <p>
                {portfolio.careerGoal ||
                  "Build and showcase your professional career profile."}
              </p>

              <div className="portfolio-links">

                {portfolio.githubUrl && (
                  <a
                    href={
                      portfolio.githubUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub ↗
                  </a>
                )}

                {portfolio.linkedinUrl && (
                  <a
                    href={
                      portfolio.linkedinUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn ↗
                  </a>
                )}

              </div>

            </div>

            <div className="portfolio-hero-side">

              <div className="portfolio-match">

                <span>
                  CAREER MATCH
                </span>

                <strong>
                  {recommendedCareer
                    ? `${recommendedCareer[1]}%`
                    : "—"}
                </strong>

                <small>
                  {recommendedCareer
                    ? recommendedCareer[0]
                    : "Complete assessment"}
                </small>

              </div>

              <div className="portfolio-actions">

                {!editing && (
                  <button
                    className="portfolio-primary-button"
                    onClick={() => {
                      setEditing(true);
                      setMessage("");
                    }}
                  >
                    Edit Portfolio
                    <span>✎</span>
                  </button>
                )}

                <button
                  className="portfolio-secondary-button"
                  onClick={() =>
                    setShowResume(true)
                  }
                >
                  Build Resume
                  <span>↗</span>
                </button>

              </div>

            </div>

          </section>

          {/* =================================================
              MESSAGE
          ================================================= */}

          {message && (
            <div className="portfolio-message">
              <span>✓</span>
              {message}
            </div>
          )}

          {/* =================================================
              CAREER OVERVIEW
          ================================================= */}

          <section className="portfolio-section">

            <div className="portfolio-section-heading">

              <div>

                <span>
                  CAREER PROFILE
                </span>

                <h2>
                  Career Overview
                </h2>

              </div>

            </div>

            <div className="portfolio-overview-grid">

              <div className="portfolio-info-card">

                <span>
                  NAME
                </span>

                <strong>
                  {userName}
                </strong>

              </div>

              <div className="portfolio-info-card">

                <span>
                  EMAIL
                </span>

                <strong>
                  {user?.email ||
                    "Not provided"}
                </strong>

              </div>

              <div className="portfolio-info-card highlight">

                <span>
                  RECOMMENDED CAREER
                </span>

                <strong>
                  {recommendedCareer
                    ? recommendedCareer[0]
                    : "Complete assessment"}
                </strong>

              </div>

              <div className="portfolio-info-card score">

                <span>
                  SKILL ALIGNMENT
                </span>

                <strong>
                  {recommendedCareer
                    ? `${recommendedCareer[1]}%`
                    : "0%"}
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              EDIT FORM
          ================================================= */}

          {editing && (
            <section className="portfolio-section portfolio-edit-section">

              <div className="portfolio-section-heading">

                <div>

                  <span>
                    EDIT PROFILE
                  </span>

                  <h2>
                    Update Your Portfolio
                  </h2>

                </div>

              </div>

              <div className="portfolio-edit-grid">

                <div className="portfolio-input-group">

                  <label>
                    Career Goal
                  </label>

                  <input
                    type="text"
                    name="careerGoal"
                    value={
                      portfolio.careerGoal
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: AI / ML Engineer"
                  />

                </div>

                <div className="portfolio-input-group full">

                  <label>
                    Professional Bio
                  </label>

                  <textarea
                    name="bio"
                    value={
                      portfolio.bio
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Write a short professional introduction..."
                    rows="5"
                  />

                </div>

                <div className="portfolio-input-group">

                  <label>
                    GitHub URL
                  </label>

                  <input
                    type="text"
                    name="githubUrl"
                    value={
                      portfolio.githubUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://github.com/yourusername"
                  />

                </div>

                <div className="portfolio-input-group">

                  <label>
                    LinkedIn URL
                  </label>

                  <input
                    type="text"
                    name="linkedinUrl"
                    value={
                      portfolio.linkedinUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://linkedin.com/in/yourprofile"
                  />

                </div>

                <div className="portfolio-input-group full">

                  <label>
                    Skills
                  </label>

                  <textarea
                    name="skills"
                    value={
                      portfolio.skills
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Python, Java, Machine Learning, SQL, React..."
                    rows="3"
                  />

                </div>

                <div className="portfolio-input-group full">

                  <label>
                    Projects
                  </label>

                  <textarea
                    id="portfolio-projects-input"
                    name="projects"
                    value={
                      portfolio.projects
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={`Example:

Movie Recommendation System
React, Python, Machine Learning, MySQL

CareerBridge
React, Spring Boot, MySQL`}
                    rows="7"
                  />

                </div>

              </div>

              <div className="portfolio-edit-actions">

                <button
                  className="portfolio-secondary-button"
                  onClick={() => {
                    setEditing(false);
                    setMessage("");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="portfolio-primary-button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Portfolio"}
                </button>

              </div>

            </section>
          )}

          {/* =================================================
              PROFESSIONAL SUMMARY
          ================================================= */}

          <section className="portfolio-section">

            <div className="portfolio-section-heading">

              <div>

                <span>
                  ABOUT
                </span>

                <h2>
                  Professional Summary
                </h2>

              </div>

            </div>

            <div className="portfolio-summary">

              <div className="portfolio-summary-mark">
                “
              </div>

              <p>
                {portfolio.bio ||
                  "Add a professional bio to tell employers about yourself."}
              </p>

            </div>

          </section>

          {/* =================================================
              TECHNICAL SKILLS
          ================================================= */}

          <section className="portfolio-section">

            <div className="portfolio-section-heading">

              <div>

                <span>
                  EXPERTISE
                </span>

                <h2>
                  Technical Skills
                </h2>

              </div>

              <span className="portfolio-count">
                {skillsList.length} Skills
              </span>

            </div>

            <div className="portfolio-skills">

              {skillsList.map(
                (skill) => (
                  <span key={skill}>
                    <b>✓</b>
                    {skill}
                  </span>
                )
              )}

            </div>

          </section>

          {/* =================================================
              COURSES
          ================================================= */}

          <section className="portfolio-section">

            <div className="portfolio-section-heading">

              <div>

                <span>
                  LEARNING
                </span>

                <h2>
                  Completed Courses
                </h2>

              </div>

              <Link to="/learning">
                View learning →
              </Link>

            </div>

            <div className="portfolio-course-list">

              {completedCourses.length ===
              0 ? (

                <div className="portfolio-empty">
                  No courses completed yet.
                </div>

              ) : (

                completedCourses.map(
                  (course, index) => (

                    <div
                      className="portfolio-course"
                      key={course}
                    >

                      <div className="portfolio-course-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <div className="portfolio-course-info">

                        <strong>
                          {course}
                        </strong>

                        <span>
                          CareerBridge Learning Path
                        </span>

                      </div>

                      <div className="portfolio-complete">
                        ✓ Completed
                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

          {/* =================================================
              ASSESSMENT
          ================================================= */}

          <section className="portfolio-section">

            <div className="portfolio-section-heading">

              <div>

                <span>
                  CAREER ASSESSMENT
                </span>

                <h2>
                  Assessment Results
                </h2>

              </div>

              <Link to="/assessment">
                Retake assessment →
              </Link>

            </div>

            <div className="portfolio-assessment-grid">

              <div className="portfolio-assessment-card">

                <div>

                  <span>
                    AI / ML
                  </span>

                  <small>
                    Career alignment
                  </small>

                </div>

                <strong>
                  {assessment
                    ? `${assessment.aiMlScore}%`
                    : "—"}
                </strong>

              </div>

              <div className="portfolio-assessment-card">

                <div>

                  <span>
                    DATA SCIENTIST
                  </span>

                  <small>
                    Career alignment
                  </small>

                </div>

                <strong>
                  {assessment
                    ? `${assessment.dataScientistScore}%`
                    : "—"}
                </strong>

              </div>

              <div className="portfolio-assessment-card">

                <div>

                  <span>
                    SOFTWARE ENGINEER
                  </span>

                  <small>
                    Career alignment
                  </small>

                </div>

                <strong>
                  {assessment
                    ? `${assessment.softwareEngineerScore}%`
                    : "—"}
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              PROJECTS
          ================================================= */}

          <section className="portfolio-section">

            <div className="portfolio-section-heading">

              <div>

                <span>
                  PROJECTS
                </span>

                <h2>
                  Featured Projects
                </h2>

              </div>

              <button
                className="portfolio-project-add-button"
                onClick={() => {

                  setEditing(true);
                  setMessage("");

                  setTimeout(() => {

                    document
                      .getElementById(
                        "portfolio-projects-input"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                        block:
                          "center",
                      });

                    document
                      .getElementById(
                        "portfolio-projects-input"
                      )
                      ?.focus();

                  }, 100);

                }}
              >
                + Add Project
              </button>

            </div>

            {portfolio.projects ? (

              <div className="portfolio-project-content">

                <div className="portfolio-project-header">

                  <div className="portfolio-project-icon">
                    ◆
                  </div>

                  <div>

                    <strong>
                      Featured Project
                    </strong>

                    <span>
                      Career Project
                    </span>

                  </div>

                </div>

                <div className="portfolio-project-description">
                  {portfolio.projects}
                </div>

              </div>

            ) : (

              <div className="portfolio-project-empty">

                <div className="portfolio-project-icon">
                  +
                </div>

                <div className="portfolio-project-empty-content">

                  <h3>
                    Add your projects
                  </h3>

                  <p>
                    Showcase your academic,
                    personal, internship,
                    and GitHub projects.
                  </p>

                  <button
                    className="portfolio-project-add-button"
                    onClick={() => {

                      setEditing(true);
                      setMessage("");

                      setTimeout(() => {

                        document
                          .getElementById(
                            "portfolio-projects-input"
                          )
                          ?.scrollIntoView({
                            behavior:
                              "smooth",
                            block:
                              "center",
                          });

                        document
                          .getElementById(
                            "portfolio-projects-input"
                          )
                          ?.focus();

                      }, 100);

                    }}
                  >
                    + Add Project
                  </button>

                </div>

              </div>

            )}

          </section>

        </div>

      </main>

      {/* =====================================================
          RESUME PREVIEW
      ===================================================== */}

      {showResume && (

        <div className="resume-overlay">

          <div className="resume-modal">

            <div className="resume-modal-header">

              <div>

                <span>
                  CAREERBRIDGE RESUME
                </span>

                <h2>
                  Resume Preview
                </h2>

              </div>

              <div className="resume-modal-actions">

                <button
                  className="portfolio-secondary-button"
                  onClick={
                    handlePrintResume
                  }
                >
                  Print / Save PDF
                </button>

                <button
                  className="resume-close-button"
                  onClick={() =>
                    setShowResume(false)
                  }
                >
                  ×
                </button>

              </div>

            </div>

            <div className="resume-document">

              {/* =================================================
                  RESUME HEADER
              ================================================= */}

              <div className="resume-header">

                <h1>
                  {userName}
                </h1>

                <p>
                  {portfolio.careerGoal ||
                    recommendedCareer?.[0] ||
                    "Career Explorer"}
                </p>

                <div className="resume-contact">

                  <span>
                    {user?.email ||
                      "Email not provided"}
                  </span>

                  {education.college && (
                    <span>
                      {education.college}
                    </span>
                  )}

                  {portfolio.githubUrl && (
                    <a
                      href={
                        portfolio.githubUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}

                  {portfolio.linkedinUrl && (
                    <a
                      href={
                        portfolio.linkedinUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}

                </div>

              </div>

              {/* =================================================
                  PROFESSIONAL SUMMARY
              ================================================= */}

              <div className="resume-section">

                <h3>
                  PROFESSIONAL SUMMARY
                </h3>

                <p>
                  {portfolio.bio ||
                    "Motivated professional building skills and experience for a career in technology."}
                </p>

              </div>

              {/* =================================================
                  EDUCATION
              ================================================= */}

              <div className="resume-section">

                <h3>
                  EDUCATION
                </h3>

                {(
                  education.degree ||
                  education.college ||
                  education.branch ||
                  education.graduationYear ||
                  education.cgpa
                ) ? (

                  <div className="resume-education">

                    <div className="resume-education-main">

                      {education.degree && (
                        <strong>
                          {education.degree}
                        </strong>
                      )}

                      {education.branch && (
                        <span>
                          {education.branch}
                        </span>
                      )}

                      {education.college && (
                        <span>
                          {education.college}
                        </span>
                      )}

                    </div>

                    <div className="resume-education-details">

                      {education.graduationYear && (
                        <span>
                          {education.graduationYear}
                        </span>
                      )}

                      {education.cgpa && (
                        <span>
                          CGPA: {education.cgpa}
                        </span>
                      )}

                    </div>

                  </div>

                ) : (

                  <p>
                    Education details not added yet.
                  </p>

                )}

              </div>

              {/* =================================================
                  TECHNICAL SKILLS
              ================================================= */}

              <div className="resume-section">

                <h3>
                  TECHNICAL SKILLS
                </h3>

                <div className="resume-skills">

                  {skillsList.map(
                    (skill) => (
                      <span key={skill}>
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  PROJECTS
              ================================================= */}

              <div className="resume-section">

                <h3>
                  PROJECTS
                </h3>

                {portfolio.projects ? (

                  <div className="resume-projects">
                    {portfolio.projects}
                  </div>

                ) : (

                  <p>
                    No projects added yet.
                  </p>

                )}

              </div>

              {/* =================================================
                  COURSES & CERTIFICATIONS
              ================================================= */}

              <div className="resume-section">

                <h3>
                  COURSES & CERTIFICATIONS
                </h3>

                {completedCourses.length >
                0 ? (

                  <ul>

                    {completedCourses.map(
                      (course) => (

                        <li key={course}>
                          {course}
                        </li>

                      )
                    )}

                  </ul>

                ) : (

                  <p>
                    No completed courses yet.
                  </p>

                )}

              </div>

              {/* =================================================
                  CAREER ASSESSMENT
              ================================================= */}

              <div className="resume-section">

                <h3>
                  CAREER ASSESSMENT
                </h3>

                {assessment ? (

                  <div className="resume-assessment">

                    <span>
                      AI / ML:{" "}
                      {assessment.aiMlScore}%
                    </span>

                    <span>
                      Data Scientist:{" "}
                      {
                        assessment.dataScientistScore
                      }%
                    </span>

                    <span>
                      Software Engineer:{" "}
                      {
                        assessment.softwareEngineerScore
                      }%
                    </span>

                  </div>

                ) : (

                  <p>
                    Career assessment not completed.
                  </p>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Portfolio;