import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Applications() {
  const [userId, setUserId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // --------------------------------------------------
  // STANDARDIZED JOB DATA
  // --------------------------------------------------

  const jobs = [
    {
      id: 1,
      title: "Junior AI / ML Engineer",
      company: "TechNova",
      location: "Hyderabad",
      type: "Full-time",
      category: "AI & ML",
      salary: "₹6–10 LPA",
      mode: "Hybrid",
    },

    {
      id: 2,
      title: "Data Analyst",
      company: "DataSphere",
      location: "Bengaluru",
      type: "Full-time",
      category: "Data",
      salary: "₹5–8 LPA",
      mode: "Remote",
    },

    {
      id: 3,
      title: "Software Engineer",
      company: "CloudWorks",
      location: "Hyderabad",
      type: "Full-time",
      category: "Software",
      salary: "₹7–12 LPA",
      mode: "On-site",
    },

    {
      id: 4,
      title: "Frontend Developer",
      company: "PixelLabs",
      location: "Pune",
      type: "Full-time",
      category: "Web Development",
      salary: "₹5–9 LPA",
      mode: "Hybrid",
    },

    {
      id: 5,
      title: "Machine Learning Intern",
      company: "InnovateAI",
      location: "Hyderabad",
      type: "Internship",
      category: "AI & ML",
      salary: "₹25K–₹40K/month",
      mode: "Hybrid",
    },

    {
      id: 6,
      title: "Backend Developer",
      company: "NextStack",
      location: "Chennai",
      type: "Full-time",
      category: "Software",
      salary: "₹6–11 LPA",
      mode: "Remote",
    },
  ];

  // --------------------------------------------------
  // APPLICATION STATUS FLOW
  // --------------------------------------------------

  const statusSteps = [
    "APPLIED",
    "UNDER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW",
    "SELECTED",
  ];

  // --------------------------------------------------
  // LOAD USER
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

      if (user?.id) {
        setUserId(user.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(
        "Unable to read logged-in user",
        error
      );

      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // LOAD APPLICATIONS
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) {
      return;
    }

    loadApplications();
  }, [userId]);

  const loadApplications = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/user/${userId}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load applications"
        );
      }

      const data = await response.json();

      setApplications(data);
    } catch (error) {
      console.error(
        "Unable to load applications",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FIND JOB
  // --------------------------------------------------

  const getJob = (jobId) => {
    return jobs.find(
      (job) => job.id === jobId
    );
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // GET CURRENT TRACKER STEP
  // --------------------------------------------------

  const getStepNumber = (status) => {
    const index =
      statusSteps.indexOf(status);

    return index === -1 ? 0 : index;
  };

  // --------------------------------------------------
  // UPDATE APPLICATION STATUS
  // --------------------------------------------------

  const updateStatus = async (
    applicationId,
    newStatus
  ) => {
    setUpdatingId(applicationId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/${applicationId}/status?status=${newStatus}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to update status"
        );
      }

      const updatedApplication =
        await response.json();

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? updatedApplication
            : application
        )
      );
    } catch (error) {
      console.error(
        "Unable to update application status",
        error
      );

      alert(
        "Unable to update application status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // --------------------------------------------------
  // NOT LOGGED IN
  // --------------------------------------------------

  if (!userId) {
    return (
      <div className="dashboard-layout">

        <Sidebar />

        <main className="dashboard-main">

          <div className="dashboard-content">

            <div className="page-header">

              <div>

                <span className="page-eyebrow">
                  APPLICATIONS
                </span>

                <h1>
                  My Applications
                </h1>

                <p>
                  Track the jobs you have applied for.
                </p>

              </div>

            </div>

            <div className="empty-state">

              <div className="empty-state-icon">
                ◉
              </div>

              <h2>
                Please login first
              </h2>

              <p>
                Login to view your job applications.
              </p>

              <Link
                to="/login"
                className="primary-button"
              >
                Login
              </Link>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // --------------------------------------------------
  // MAIN PAGE
  // --------------------------------------------------

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        <div className="dashboard-content">

          {/* HEADER */}

          <div className="page-header">

            <div>

              <span className="page-eyebrow">
                APPLICATIONS
              </span>

              <h1>
                My Applications
              </h1>

              <p>
                Track the jobs you have applied for.
              </p>

            </div>

            <Link
              to="/jobs"
              className="primary-button"
            >
              Explore Jobs
            </Link>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="empty-state">

              <div className="empty-state-icon">
                ...
              </div>

              <h2>
                Loading applications
              </h2>

              <p>
                Please wait while we load your applications.
              </p>

            </div>

          ) : applications.length === 0 ? (

            /* EMPTY */

            <div className="empty-state">

              <div className="empty-state-icon">
                ◫
              </div>

              <h2>
                No applications yet
              </h2>

              <p>
                You haven't applied for any jobs yet.
                Find a job that matches your skills and
                submit your first application.
              </p>

              <Link
                to="/jobs"
                className="primary-button"
              >
                Find Jobs
              </Link>

            </div>

          ) : (

            /* APPLICATION LIST */

            <div className="applications-list">

              {/* SUMMARY */}

              <div className="applications-summary">

                <div>

                  <strong>
                    {applications.length}
                  </strong>

                  <span>
                    {applications.length === 1
                      ? " Application"
                      : " Applications"}
                  </span>

                </div>

                <span>
                  Latest applications first
                </span>

              </div>

              {/* APPLICATION CARDS */}

              {applications.map(
                (application) => {

                  const job =
                    getJob(application.jobId);

                  /*
                   * If an old application contains
                   * a job ID that is no longer part
                   * of the standardized dataset,
                   * don't crash the page.
                   */

                  if (!job) {
                    return (
                      <div
                        className="application-card"
                        key={application.id}
                      >

                        <div className="application-card-main">

                          <div className="application-job-icon">
                            ?
                          </div>

                          <div className="application-job-info">

                            <span className="job-category">
                              JOB
                            </span>

                            <h2>
                              Job #{application.jobId}
                            </h2>

                            <p className="application-company">
                              Job information unavailable
                            </p>

                          </div>

                          <div className="application-status-area">

                            <span className="application-status applied">
                              {application.status}
                            </span>

                            <span className="application-date">
                              Applied{" "}
                              {formatDate(
                                application.appliedAt
                              )}
                            </span>

                          </div>

                        </div>

                      </div>
                    );
                  }

                  const currentStep =
                    getStepNumber(
                      application.status
                    );

                  const isRejected =
                    application.status ===
                    "REJECTED";

                  return (
                    <div
                      className="application-card"
                      key={application.id}
                    >

                      {/* --------------------------------
                          APPLICATION HEADER
                      -------------------------------- */}

                      <div className="application-card-main">

                        <div className="application-job-icon">
                          {job.title
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="application-job-info">

                          <span className="job-category">
                            {job.category}
                          </span>

                          <h2>
                            {job.title}
                          </h2>

                          <p className="application-company">
                            {job.company}
                          </p>

                          <div className="application-meta">

                            <span>
                              📍 {job.location}
                            </span>

                            <span>
                              💼 {job.type}
                            </span>

                            <span>
                              💰 {job.salary}
                            </span>

                            <span>
                              {job.mode}
                            </span>

                          </div>

                        </div>

                        <div className="application-status-area">

                          <span
                            className={
                              isRejected
                                ? "application-status rejected"
                                : application.status ===
                                  "SELECTED"
                                ? "application-status selected"
                                : "application-status applied"
                            }
                          >
                            {application.status}
                          </span>

                          <span className="application-date">
                            Applied{" "}
                            {formatDate(
                              application.appliedAt
                            )}
                          </span>

                        </div>

                      </div>

                      {/* --------------------------------
                          APPLICATION TRACKER
                      -------------------------------- */}

                      {!isRejected && (

                        <div className="application-tracker">

                          {statusSteps.map(
                            (step, index) => {

                              const completed =
                                index <=
                                currentStep;

                              const isCurrent =
                                index ===
                                currentStep;

                              return (
                                <div
                                  className="tracker-step-wrapper"
                                  key={step}
                                >

                                  <div
                                    className={
                                      completed
                                        ? isCurrent
                                          ? "tracker-step current"
                                          : "tracker-step completed"
                                        : "tracker-step"
                                    }
                                  >
                                    {completed
                                      ? "✓"
                                      : index + 1}
                                  </div>

                                  <span
                                    className={
                                      completed
                                        ? "tracker-label active"
                                        : "tracker-label"
                                    }
                                  >
                                    {step.replace(
                                      "_",
                                      " "
                                    )}
                                  </span>

                                  {index <
                                    statusSteps.length -
                                      1 && (
                                    <div
                                      className={
                                        index <
                                        currentStep
                                          ? "tracker-line completed"
                                          : "tracker-line"
                                      }
                                    />
                                  )}

                                </div>
                              );
                            }
                          )}

                        </div>

                      )}

                      {/* --------------------------------
                          REJECTED MESSAGE
                      -------------------------------- */}

                      {isRejected && (

                        <div className="application-rejected-message">

                          <strong>
                            Application Rejected
                          </strong>

                          <p>
                            This application is no longer
                            active.
                          </p>

                        </div>

                      )}

                      {/* --------------------------------
                          FOOTER
                      -------------------------------- */}

                      <div className="application-card-footer">

                        <div>

                          {application.resumeUrl && (
                            <a
                              href={
                                application.resumeUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="application-link"
                            >
                              View Resume / Portfolio
                            </a>
                          )}

                        </div>

                        <div className="application-footer-actions">

                          <Link
                            to={`/jobs/${job.id}`}
                            className="application-view-button"
                          >
                            View Job →
                          </Link>

                        </div>

                      </div>

                      {/* --------------------------------
                          DEMO STATUS CONTROLS
                      -------------------------------- */}

                      <div className="application-demo-controls">

                        <div>

                          <strong>
                            Demo Status Controls
                          </strong>

                          <span>
                            Use these controls to simulate
                            application progress.
                          </span>

                        </div>

                        <div className="application-status-buttons">

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "APPLIED"
                              )
                            }
                          >
                            Applied
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "UNDER_REVIEW"
                              )
                            }
                          >
                            Under Review
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "SHORTLISTED"
                              )
                            }
                          >
                            Shortlisted
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "INTERVIEW"
                              )
                            }
                          >
                            Interview
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "SELECTED"
                              )
                            }
                          >
                            Selected
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application.id
                            }
                            onClick={() =>
                              updateStatus(
                                application.id,
                                "REJECTED"
                              )
                            }
                          >
                            Rejected
                          </button>

                        </div>

                      </div>

                      {/* --------------------------------
                          COVER LETTER
                      -------------------------------- */}

                      {application.coverLetter && (

                        <div className="application-cover-letter">

                          <strong>
                            Cover Letter
                          </strong>

                          <p>
                            {application.coverLetter}
                          </p>

                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Applications;