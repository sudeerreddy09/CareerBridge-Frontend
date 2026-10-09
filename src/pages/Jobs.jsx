import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const jobs = [
  {
    id: 1,
    title: "Junior AI / ML Engineer",
    company: "TechNova",
    location: "Hyderabad, India",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹6 - 10 LPA",
    category: "AI & ML",
    match: 94,
    logo: "TN",
    skills: ["Python", "Machine Learning", "SQL"],
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "DataSphere",
    location: "Bengaluru, India",
    type: "Full-time",
    mode: "Remote",
    salary: "₹5 - 8 LPA",
    category: "Data",
    match: 89,
    logo: "DS",
    skills: ["Python", "SQL", "Tableau"],
  },
  {
    id: 3,
    title: "Software Engineer",
    company: "CloudWorks",
    location: "Hyderabad, India",
    type: "Full-time",
    mode: "On-site",
    salary: "₹7 - 12 LPA",
    category: "Software",
    match: 86,
    logo: "CW",
    skills: ["Java", "Spring Boot", "MySQL"],
  },
  {
    id: 4,
    title: "Frontend Developer",
    company: "PixelLabs",
    location: "Pune, India",
    type: "Full-time",
    mode: "Hybrid",
    salary: "₹5 - 9 LPA",
    category: "Web Development",
    match: 82,
    logo: "PL",
    skills: ["React", "JavaScript", "CSS"],
  },
  {
    id: 5,
    title: "Machine Learning Intern",
    company: "InnovateAI",
    location: "Hyderabad, India",
    type: "Internship",
    mode: "Hybrid",
    salary: "₹25K - ₹40K / month",
    category: "AI & ML",
    match: 91,
    logo: "IA",
    skills: ["Python", "NumPy", "Scikit-learn"],
  },
  {
    id: 6,
    title: "Backend Developer",
    company: "NextStack",
    location: "Chennai, India",
    type: "Full-time",
    mode: "Remote",
    salary: "₹6 - 11 LPA",
    category: "Software",
    match: 84,
    logo: "NS",
    skills: ["Java", "Spring Boot", "REST API"],
  },
];

const categories = [
  "All",
  "AI & ML",
  "Data",
  "Software",
  "Web Development",
];

const jobTypes = [
  "All",
  "Full-time",
  "Internship",
];

function Jobs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");

  const [savedJobs, setSavedJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const [assessment, setAssessment] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});

  const [savingJobId, setSavingJobId] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const totalCourses = 6;

  // --------------------------------------------------
  // LOAD LOGGED-IN USER
  // --------------------------------------------------

  useEffect(() => {
    const storedUser =
      localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      setLoadingProfile(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser && parsedUser.id) {
        setUser(parsedUser);
        setUserId(parsedUser.id);
      }
    } catch (error) {
      console.error(
        "Error reading logged-in user:",
        error
      );
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // --------------------------------------------------
  // LOAD SAVED JOBS
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadSavedJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/saved-jobs/user/${userId}`
        );

        if (!response.ok) {
          throw new Error(
            "Could not load saved jobs"
          );
        }

        const data = await response.json();

        const ids = data.map(
          (savedJob) => savedJob.jobId
        );

        setSavedJobs(ids);
      } catch (error) {
        console.error(
          "Error loading saved jobs:",
          error
        );
      }
    };

    loadSavedJobs();
  }, [userId]);

  // --------------------------------------------------
  // LOAD ASSESSMENT + COURSE PROGRESS
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) {
      return;
    }

    const loadCareerData = async () => {
      try {
        // --------------------------------------------
        // ASSESSMENT
        // --------------------------------------------

        const assessmentResponse = await fetch(
          `http://localhost:8080/api/assessment/user/${userId}`
        );

        if (assessmentResponse.ok) {
          const assessmentData =
            await assessmentResponse.json();

          setAssessment(assessmentData);
        }

        // --------------------------------------------
        // COURSE PROGRESS
        // --------------------------------------------

        const progressData = {};

        for (
          let courseId = 1;
          courseId <= totalCourses;
          courseId++
        ) {
          const response = await fetch(
            `http://localhost:8080/api/course-progress/user/${userId}/course/${courseId}`
          );

          if (response.ok) {
            const data = await response.json();

            progressData[courseId] =
              data.progress || 0;
          } else {
            progressData[courseId] = 0;
          }
        }

        setCourseProgress(progressData);
      } catch (error) {
        console.error(
          "Error loading career data:",
          error
        );
      }
    };

    loadCareerData();
  }, [userId]);

  // --------------------------------------------------
  // CAREER RECOMMENDATION
  // --------------------------------------------------

  const careerScores = useMemo(() => {
    if (!assessment) {
      return {};
    }

    return {
      "AI / ML Engineer":
        assessment.aiMlScore || 0,

      "Data Scientist":
        assessment.dataScientistScore || 0,

      "Software Engineer":
        assessment.softwareEngineerScore || 0,
    };
  }, [assessment]);

  const recommendedCareer = useMemo(() => {
    const entries =
      Object.entries(careerScores);

    if (!entries.length) {
      return null;
    }

    return entries.sort(
      (a, b) => b[1] - a[1]
    )[0];
  }, [careerScores]);

  // --------------------------------------------------
  // CAREER → JOB CATEGORY
  // --------------------------------------------------

  const getCareerCategory = (career) => {
    if (!career) {
      return null;
    }

    if (
      career === "AI / ML Engineer"
    ) {
      return "AI & ML";
    }

    if (
      career === "Data Scientist"
    ) {
      return "Data";
    }

    if (
      career === "Software Engineer"
    ) {
      return "Software";
    }

    return null;
  };

  const recommendedCategory =
    getCareerCategory(
      recommendedCareer?.[0]
    );

  // --------------------------------------------------
  // PERSONALIZED JOB SCORE
  // --------------------------------------------------

  const getPersonalizedMatch = (job) => {
    let score = job.match;

    // Strong boost for the user's
    // recommended career category.
    if (
      recommendedCategory &&
      job.category === recommendedCategory
    ) {
      score += 5;
    }

    // Small boost for Hyderabad jobs.
    if (
      user?.location &&
      job.location
        .toLowerCase()
        .includes(
          user.location.toLowerCase()
        )
    ) {
      score += 2;
    }

    return Math.min(score, 100);
  };

  // --------------------------------------------------
  // PERSONALIZED JOBS
  // --------------------------------------------------

  const personalizedJobs = useMemo(() => {
    return jobs
      .map((job) => ({
        ...job,
        personalizedMatch:
          getPersonalizedMatch(job),
      }))
      .sort(
        (a, b) =>
          b.personalizedMatch -
          a.personalizedMatch
      );
  }, [
    recommendedCategory,
    user?.location,
  ]);

  // --------------------------------------------------
  // PROFILE STRENGTH
  // --------------------------------------------------

  const profileStrength = useMemo(() => {
    const assessmentProgress =
      assessment ? 100 : 0;

    const courseValues =
      Object.values(courseProgress);

    const learningProgress =
      courseValues.length
        ? Math.round(
            courseValues.reduce(
              (sum, value) =>
                sum + value,
              0
            ) /
              totalCourses
          )
        : 0;

    /*
      Profile strength is based on:
      - Assessment: 40%
      - Learning: 40%
      - Basic profile: 20%
    */

    const hasBasicProfile =
      user?.name &&
      user?.email
        ? 100
        : 0;

    return Math.round(
      assessmentProgress * 0.4 +
      learningProgress * 0.4 +
      hasBasicProfile * 0.2
    );
  }, [
    assessment,
    courseProgress,
    user,
  ]);

  // --------------------------------------------------
  // SHOW MESSAGE
  // --------------------------------------------------

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  // --------------------------------------------------
  // SAVE / UNSAVE JOB
  // --------------------------------------------------

  const toggleSaved = async (jobId) => {
    if (!userId) {
      showMessage(
        "Please login to save jobs."
      );

      return;
    }

    const isSaved =
      savedJobs.includes(jobId);

    try {
      setSavingJobId(jobId);

      // --------------------------------------------
      // REMOVE JOB
      // --------------------------------------------

      if (isSaved) {
        const response = await fetch(
          `http://localhost:8080/api/saved-jobs/user/${userId}/job/${jobId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to remove job"
          );
        }

        setSavedJobs((current) =>
          current.filter(
            (id) => id !== jobId
          )
        );

        showMessage(
          "Job removed from saved jobs."
        );
      }

      // --------------------------------------------
      // SAVE JOB
      // --------------------------------------------

      else {
        const response = await fetch(
          "http://localhost:8080/api/saved-jobs/save",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId,
              jobId,
            }),
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          throw new Error(
            errorText ||
              "Failed to save job"
          );
        }

        setSavedJobs((current) => [
          ...current,
          jobId,
        ]);

        showMessage(
          "Job saved successfully."
        );
      }
    } catch (error) {
      console.error(
        "Save job error:",
        error
      );

      showMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setSavingJobId(null);
    }
  };

  // --------------------------------------------------
  // FILTER JOBS
  // --------------------------------------------------

  const filteredJobs = useMemo(() => {
    return personalizedJobs.filter(
      (job) => {
        const text =
          search.toLowerCase();

        const matchesSearch =
          job.title
            .toLowerCase()
            .includes(text) ||
          job.company
            .toLowerCase()
            .includes(text) ||
          job.location
            .toLowerCase()
            .includes(text) ||
          job.skills.some((skill) =>
            skill
              .toLowerCase()
              .includes(text)
          );

        const matchesCategory =
          category === "All" ||
          job.category === category;

        const matchesType =
          jobType === "All" ||
          job.type === jobType;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesType
        );
      }
    );
  }, [
    personalizedJobs,
    search,
    category,
    jobType,
  ]);

  // --------------------------------------------------
  // TOP RECOMMENDED JOBS
  // --------------------------------------------------

  const recommendedJobs =
    personalizedJobs.slice(0, 3);

  // --------------------------------------------------
  // USER DISPLAY
  // --------------------------------------------------

  const userName =
    user?.name ||
    "Career Explorer";

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingProfile) {
    return (
      <div className="jobs-page">
        <Sidebar />

        <main className="jobs-main">
          <div className="jobs-content">
            <div className="jobs-empty">
              <strong>
                Loading your career profile...
              </strong>

              <p>
                Preparing personalized job
                recommendations.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="jobs-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="jobs-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="jobs-topbar">

          <div className="jobs-top-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search jobs, companies or skills..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="jobs-top-user">

            <span className="jobs-notification">
              ♢
            </span>

            <Link to="/profile">

              <div className="jobs-avatar">
                {userInitial}
              </div>

            </Link>

          </div>

        </header>

        <div className="jobs-content">

          {/* =================================================
              SAVE MESSAGE
          ================================================= */}

          {message && (
            <div className="jobs-save-message">
              {message}
            </div>
          )}

          {/* =================================================
              HERO
          ================================================= */}

          <section className="jobs-hero">

            <div>

              <span className="jobs-eyebrow">
                CAREER OPPORTUNITIES
              </span>

              <h1>
                Find your next
                <br />
                career opportunity.
              </h1>

              <p>
                Discover jobs that match your
                skills, interests and career goals.
              </p>

              {recommendedCareer && (
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "11px",
                    color: "#6b7280",
                  }}
                >
                  Your recommended career:
                  <strong
                    style={{
                      marginLeft: "5px",
                      color: "#334155",
                    }}
                  >
                    {recommendedCareer[0]}
                  </strong>
                </div>
              )}

            </div>

            <div className="jobs-hero-stat">

              <span>
                YOUR MATCHES
              </span>

              <strong>
                {jobs.length}
              </strong>

              <small>
                opportunities available
              </small>

              <div className="match-mini">

                <span>
                  Profile strength
                </span>

                <b>
                  {profileStrength}%
                </b>

              </div>

            </div>

          </section>

          {/* =================================================
              RECOMMENDED JOBS
          ================================================= */}

          <section className="jobs-section">

            <div className="jobs-section-heading">

              <div>

                <span>
                  BASED ON YOUR PROFILE
                </span>

                <h2>
                  Recommended for you
                </h2>

              </div>

              <span className="jobs-result-count">
                {recommendedJobs.length} top matches
              </span>

            </div>

            <div className="recommended-job-grid">

              {recommendedJobs.map(
                (job) => (

                  <article
                    className="recommended-job-card"
                    key={job.id}
                  >

                    <div className="recommended-top">

                      <div className="job-company-logo">
                        {job.logo}
                      </div>

                      <button
                        type="button"
                        className={
                          savedJobs.includes(
                            job.id
                          )
                            ? "saved active"
                            : "saved"
                        }
                        disabled={
                          savingJobId ===
                          job.id
                        }
                        onClick={() =>
                          toggleSaved(
                            job.id
                          )
                        }
                      >

                        {savingJobId ===
                        job.id
                          ? "..."
                          : savedJobs.includes(
                              job.id
                            )
                            ? "♥"
                            : "♡"}

                      </button>

                    </div>

                    <span className="job-category">
                      {job.category}
                    </span>

                    <h3>
                      {job.title}
                    </h3>

                    <p className="job-company">
                      {job.company}
                    </p>

                    <div className="job-location">
                      📍 {job.location}
                    </div>

                    <div className="job-match">

                      <span>
                        {job.personalizedMatch}%
                        match
                      </span>

                      <div>

                        <div
                          style={{
                            width: `${job.personalizedMatch}%`,
                          }}
                        />

                      </div>

                    </div>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="job-view-button"
                    >
                      View Job →
                    </Link>

                  </article>

                )
              )}

            </div>

          </section>

          {/* =================================================
              ALL JOBS
          ================================================= */}

          <section className="jobs-section">

            <div className="jobs-section-heading">

              <div>

                <span>
                  EXPLORE OPPORTUNITIES
                </span>

                <h2>
                  All jobs
                </h2>

              </div>

              <span className="jobs-result-count">
                {filteredJobs.length} results
              </span>

            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="jobs-filters">

              <div className="jobs-filter-group">

                <span>
                  CATEGORY
                </span>

                <div>

                  {categories.map(
                    (item) => (

                      <button
                        type="button"
                        key={item}
                        className={
                          category === item
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setCategory(item)
                        }
                      >
                        {item}
                      </button>

                    )
                  )}

                </div>

              </div>

              <div className="jobs-filter-group">

                <span>
                  JOB TYPE
                </span>

                <div>

                  {jobTypes.map(
                    (item) => (

                      <button
                        type="button"
                        key={item}
                        className={
                          jobType === item
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setJobType(item)
                        }
                      >
                        {item}
                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

            {/* =================================================
                JOB LIST
            ================================================= */}

            <div className="job-list">

              {filteredJobs.map(
                (job) => (

                  <article
                    className="job-list-card"
                    key={job.id}
                  >

                    <div className="job-list-logo">
                      {job.logo}
                    </div>

                    <div className="job-list-info">

                      <span className="job-category">
                        {job.category}
                      </span>

                      <h3>
                        {job.title}
                      </h3>

                      <p>
                        {job.company}
                      </p>

                      <div className="job-list-meta">

                        <span>
                          📍 {job.location}
                        </span>

                        <span>
                          ◷ {job.type}
                        </span>

                        <span>
                          ◉ {job.mode}
                        </span>

                        <span>
                          ₹ {job.salary}
                        </span>

                      </div>

                      <div className="job-skills">

                        {job.skills.map(
                          (skill) => (

                            <span key={skill}>
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                    <div className="job-list-actions">

                      <div className="job-match-small">

                        <strong>
                          {job.personalizedMatch}%
                        </strong>

                        <span>
                          match
                        </span>

                      </div>

                      <button
                        type="button"
                        className={
                          savedJobs.includes(
                            job.id
                          )
                            ? "save-job active"
                            : "save-job"
                        }
                        disabled={
                          savingJobId ===
                          job.id
                        }
                        onClick={() =>
                          toggleSaved(
                            job.id
                          )
                        }
                      >

                        {savingJobId ===
                        job.id
                          ? "Saving..."
                          : savedJobs.includes(
                              job.id
                            )
                            ? "♥ Saved"
                            : "♡ Save"}

                      </button>

                      <Link
                        to={`/jobs/${job.id}`}
                        className="job-details-button"
                      >
                        View Details
                      </Link>

                    </div>

                  </article>

                )
              )}

            </div>

            {/* =================================================
                NO RESULTS
            ================================================= */}

            {filteredJobs.length === 0 && (

              <div className="jobs-empty">

                <strong>
                  No jobs found
                </strong>

                <p>
                  Try changing your search
                  or filters.
                </p>

              </div>

            )}

          </section>

          {/* =================================================
              BOTTOM CTA
          ================================================= */}

          <section className="jobs-bottom">

            <div>

              <span>
                IMPROVE YOUR MATCHES
              </span>

              <h2>
                Want better job recommendations?
              </h2>

              <p>
                Complete your career assessment
                and keep building your skills to
                improve your job matches.
              </p>

            </div>

            <Link
              to="/assessment"
              className="jobs-cta"
            >
              Take Assessment →
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Jobs;