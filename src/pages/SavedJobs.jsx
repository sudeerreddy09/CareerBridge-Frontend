import { useEffect, useState } from "react";
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

function SavedJobs() {
  const [userId, setUserId] = useState(null);

  const [savedJobs, setSavedJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [removingJobId, setRemovingJobId] =
    useState(null);

  const [message, setMessage] = useState("");


  // --------------------------------------------------
  // GET LOGGED-IN USER
  // --------------------------------------------------

  useEffect(() => {
    const storedUser =
      localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user && user.id) {
        setUserId(user.id);
      } else {
        setLoading(false);
      }

    } catch (error) {
      console.error(
        "Error reading user:",
        error
      );

      setLoading(false);
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

        setLoading(true);

        const response = await fetch(
          `http://localhost:8080/api/saved-jobs/user/${userId}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load saved jobs"
          );
        }

        const data = await response.json();

        setSavedJobs(data);

      } catch (error) {

        console.error(
          "Error loading saved jobs:",
          error
        );

        setMessage(
          "Unable to load saved jobs."
        );

      } finally {

        setLoading(false);

      }
    };

    loadSavedJobs();

  }, [userId]);


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
  // REMOVE SAVED JOB
  // --------------------------------------------------

  const removeSavedJob = async (jobId) => {

    if (!userId) {
      return;
    }

    try {

      setRemovingJobId(jobId);

      const response = await fetch(
        `http://localhost:8080/api/saved-jobs/user/${userId}/job/${jobId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to remove saved job"
        );
      }

      setSavedJobs((current) =>
        current.filter(
          (item) =>
            Number(item.jobId) !== Number(jobId)
        )
      );

      showMessage(
        "Job removed from saved jobs."
      );

    } catch (error) {

      console.error(
        "Remove saved job error:",
        error
      );

      showMessage(
        "Unable to remove job."
      );

    } finally {

      setRemovingJobId(null);

    }
  };


  // --------------------------------------------------
  // MATCH SAVED DATABASE ROWS WITH JOB DATA
  // --------------------------------------------------

  const savedJobDetails = savedJobs
    .map((savedJob) => {

      const job = jobs.find(
        (item) =>
          Number(item.id) ===
          Number(savedJob.jobId)
      );

      if (!job) {
        return null;
      }

      return {
        ...job,
        savedAt: savedJob.savedAt,
      };

    })
    .filter(Boolean);


  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="jobs-page">

      <Sidebar />


      <main className="jobs-main">

        {/* TOPBAR */}

        <header className="jobs-topbar">

          <div className="jobs-top-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search saved jobs..."
              readOnly
            />

          </div>


          <div className="jobs-top-user">

            <span className="jobs-notification">
              ♢
            </span>

            <Link to="/profile">

              <div className="jobs-avatar">
                C
              </div>

            </Link>

          </div>

        </header>


        <div className="jobs-content">

          {/* MESSAGE */}

          {message && (

            <div className="jobs-save-message">
              {message}
            </div>

          )}


          {/* HEADER */}

          <section className="jobs-hero">

            <div>

              <span className="jobs-eyebrow">
                YOUR JOB COLLECTION
              </span>

              <h1>
                Saved jobs.
              </h1>

              <p>
                Keep track of the opportunities
                you're interested in.
              </p>

            </div>


            <div className="jobs-hero-stat">

              <span>
                SAVED JOBS
              </span>

              <strong>
                {savedJobDetails.length}
              </strong>

              <small>
                opportunities saved to your profile
              </small>

            </div>

          </section>


          {/* SAVED JOBS */}

          <section className="jobs-section">

            <div className="jobs-section-heading">

              <div>

                <span>
                  YOUR COLLECTION
                </span>

                <h2>
                  Saved opportunities
                </h2>

              </div>

              <Link
                to="/jobs"
                className="job-view-button"
              >
                Explore Jobs →
              </Link>

            </div>


            {/* LOADING */}

            {loading && (

              <div className="jobs-empty">

                <strong>
                  Loading saved jobs...
                </strong>

                <p>
                  Please wait.
                </p>

              </div>

            )}


            {/* EMPTY */}

            {!loading &&
              savedJobDetails.length === 0 && (

                <div className="jobs-empty">

                  <strong>
                    No saved jobs yet.
                  </strong>

                  <p>
                    Save interesting opportunities
                    from the Jobs page and they will
                    appear here.
                  </p>

                  <Link
                    to="/jobs"
                    className="job-view-button"
                  >
                    Explore Jobs →
                  </Link>

                </div>

              )}


            {/* SAVED JOB LIST */}

            {!loading &&
              savedJobDetails.length > 0 && (

                <div className="job-list">

                  {savedJobDetails.map((job) => (

                    <article
                      className="job-list-card"
                      key={job.id}
                    >

                      {/* LOGO */}

                      <div className="job-list-logo">
                        {job.logo}
                      </div>


                      {/* INFORMATION */}

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


                      {/* ACTIONS */}

                      <div className="job-list-actions">

                        <div className="job-match-small">

                          <strong>
                            {job.match}%
                          </strong>

                          <span>
                            match
                          </span>

                        </div>


                        <Link
                          to={`/jobs/${job.id}`}
                          className="job-details-button"
                        >
                          View Details
                        </Link>


                        <button
                          type="button"
                          className="save-job active"
                          disabled={
                            removingJobId === job.id
                          }
                          onClick={() =>
                            removeSavedJob(job.id)
                          }
                        >

                          {removingJobId === job.id
                            ? "Removing..."
                            : "♥ Saved"}

                        </button>

                      </div>

                    </article>

                  ))}

                </div>

              )}

          </section>


          {/* BOTTOM CTA */}

          <section className="jobs-bottom">

            <div>

              <span>
                KEEP EXPLORING
              </span>

              <h2>
                Looking for more opportunities?
              </h2>

              <p>
                Explore more jobs that match your
                skills and career goals.
              </p>

            </div>


            <Link
              to="/jobs"
              className="jobs-cta"
            >
              Find More Jobs →
            </Link>

          </section>

        </div>

      </main>

    </div>
  );
}

export default SavedJobs;