import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function JobDetails() {
  const { id } = useParams();

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
      description:
        "Work on machine learning solutions and AI-powered applications while collaborating with engineering teams to solve real-world problems.",
      responsibilities: [
        "Develop and improve machine learning models",
        "Prepare and analyze datasets",
        "Evaluate model performance",
        "Assist in deploying ML solutions",
        "Collaborate with software engineering teams",
      ],
      requirements: [
        "Python",
        "Machine Learning",
        "Pandas",
        "NumPy",
        "Scikit-learn",
      ],
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
      description:
        "Analyze business data, identify useful patterns and create reports that help teams make better data-driven decisions.",
      responsibilities: [
        "Clean and analyze business datasets",
        "Create reports and dashboards",
        "Identify trends and patterns",
        "Prepare data for analysis",
        "Communicate insights to stakeholders",
      ],
      requirements: [
        "SQL",
        "Excel",
        "Python",
        "Data Analysis",
        "Data Visualization",
      ],
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
      description:
        "Develop scalable software applications using modern technologies while working with a collaborative engineering team.",
      responsibilities: [
        "Develop software applications",
        "Write clean and maintainable code",
        "Build and integrate REST APIs",
        "Fix bugs and improve application performance",
        "Collaborate with development teams",
      ],
      requirements: [
        "Java",
        "Spring Boot",
        "REST APIs",
        "SQL",
        "Git",
      ],
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
      description:
        "Build responsive and user-friendly web applications using modern frontend technologies.",
      responsibilities: [
        "Develop responsive web interfaces",
        "Build reusable UI components",
        "Work with frontend APIs",
        "Improve website performance",
        "Collaborate with designers and backend developers",
      ],
      requirements: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Git",
      ],
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
      description:
        "Gain practical experience working on machine learning projects and AI applications with an experienced technical team.",
      responsibilities: [
        "Assist with machine learning projects",
        "Prepare and clean datasets",
        "Experiment with ML algorithms",
        "Support model evaluation",
        "Document project results",
      ],
      requirements: [
        "Python",
        "Basic Machine Learning",
        "NumPy",
        "Pandas",
        "Problem Solving",
      ],
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
      description:
        "Build reliable backend services and REST APIs for modern web applications while working with databases and cloud-ready systems.",
      responsibilities: [
        "Develop REST APIs",
        "Design backend services",
        "Work with relational databases",
        "Improve application performance",
        "Maintain backend services",
      ],
      requirements: [
        "Java",
        "Spring Boot",
        "MySQL",
        "REST APIs",
        "Git",
      ],
    },
  ];

  const job = jobs.find(
    (item) => item.id === Number(id)
  );

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [userId, setUserId] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const [showApplyForm, setShowApplyForm] =
    useState(false);

  const [coverLetter, setCoverLetter] =
    useState("");

  const [resumeUrl, setResumeUrl] =
    useState("");

  const [message, setMessage] = useState("");

  // --------------------------------------------------
  // LOAD LOGGED-IN USER
  // --------------------------------------------------

  useEffect(() => {
    const storedUser =
      localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user?.id) {
        setUserId(user.id);
      }
    } catch (error) {
      console.error(
        "Unable to read logged-in user",
        error
      );
    }
  }, []);

  // --------------------------------------------------
  // LOAD SAVED + APPLICATION STATUS
  // --------------------------------------------------

  useEffect(() => {
    if (!userId || !job) {
      return;
    }

    const loadJobStatus = async () => {
      try {
        // ------------------------------
        // SAVED JOB STATUS
        // ------------------------------

        const savedResponse = await fetch(
          `http://localhost:8080/api/saved-jobs/user/${userId}`
        );

        if (savedResponse.ok) {
          const savedJobs =
            await savedResponse.json();

          setIsSaved(
            savedJobs.some(
              (savedJob) =>
                savedJob.jobId === job.id
            )
          );
        }

        // ------------------------------
        // APPLICATION STATUS
        // ------------------------------

        const applicationResponse =
          await fetch(
            `http://localhost:8080/api/applications/user/${userId}/job/${job.id}`
          );

        if (applicationResponse.ok) {
          setIsApplied(true);
        } else {
          setIsApplied(false);
        }
      } catch (error) {
        console.error(
          "Unable to load job status",
          error
        );
      }
    };

    loadJobStatus();
  }, [userId, job]);

  // --------------------------------------------------
  // SAVE / UNSAVE JOB
  // --------------------------------------------------

  const toggleSaved = async () => {
    if (!userId) {
      setMessage(
        "Please login before saving a job."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (isSaved) {
        const response = await fetch(
          `http://localhost:8080/api/saved-jobs/user/${userId}/job/${job.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to remove saved job"
          );
        }

        setIsSaved(false);

        setMessage(
          "Job removed from saved jobs."
        );
      } else {
        const response = await fetch(
          "http://localhost:8080/api/saved-jobs/save",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              jobId: job.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to save job"
          );
        }

        setIsSaved(true);

        setMessage(
          "Job saved successfully."
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // APPLY FOR JOB
  // --------------------------------------------------

  const submitApplication = async (event) => {
    event.preventDefault();

    if (!userId) {
      setMessage(
        "Please login before applying for a job."
      );
      return;
    }

    if (isApplied) {
      setMessage(
        "You have already applied for this job."
      );
      return;
    }

    setApplying(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/applications/apply",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            jobId: job.id,
            resumeUrl: resumeUrl,
            coverLetter: coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          typeof data === "string"
            ? data
            : "Unable to submit application."
        );
        return;
      }

      setIsApplied(true);
      setShowApplyForm(false);

      setMessage(
        "Application submitted successfully!"
      );

      setCoverLetter("");
      setResumeUrl("");
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to submit application. Please try again."
      );
    } finally {
      setApplying(false);
    }
  };

  // --------------------------------------------------
  // JOB NOT FOUND
  // --------------------------------------------------

  if (!job) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div className="dashboard-content">
            <h1>Job not found</h1>

            <Link to="/jobs">
              ← Back to Jobs
            </Link>
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
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-content">

          <Link
            to="/jobs"
            className="job-back-link"
          >
            ← Back to Jobs
          </Link>

          <div className="job-details-card">

            {/* HEADER */}

            <div className="job-details-header">

              <div>

                <span className="job-category">
                  {job.category}
                </span>

                <h1>
                  {job.title}
                </h1>

                <p className="job-company">
                  {job.company}
                </p>

              </div>

              <div className="job-actions">

                {/* SAVE */}

                <button
                  type="button"
                  className={
                    isSaved
                      ? "job-save-button saved"
                      : "job-save-button"
                  }
                  disabled={saving}
                  onClick={toggleSaved}
                >
                  {saving
                    ? "Saving..."
                    : isSaved
                    ? "♥ Saved"
                    : "♡ Save Job"}
                </button>

                {/* APPLY */}

                <button
                  type="button"
                  className={
                    isApplied
                      ? "job-apply-button applied"
                      : "job-apply-button"
                  }
                  disabled={isApplied}
                  onClick={() => {
                    if (!userId) {
                      setMessage(
                        "Please login before applying for a job."
                      );
                      return;
                    }

                    if (!isApplied) {
                      setShowApplyForm(true);
                      setMessage("");
                    }
                  }}
                >
                  {isApplied
                    ? "✓ Applied"
                    : "Apply Now"}
                </button>

              </div>

            </div>

            {/* MESSAGE */}

            {message && (
              <div className="job-message">
                {message}
              </div>
            )}

            {/* APPLICATION FORM */}

            {showApplyForm && !isApplied && (
              <form
                className="job-application-form"
                onSubmit={submitApplication}
              >

                <div className="application-form-header">

                  <div>

                    <h2>
                      Apply for {job.title}
                    </h2>

                    <p>
                      Submit your application
                      details below.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="application-close-button"
                    onClick={() =>
                      setShowApplyForm(false)
                    }
                  >
                    ×
                  </button>

                </div>

                <label>
                  Resume / Portfolio URL
                </label>

                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={resumeUrl}
                  onChange={(event) =>
                    setResumeUrl(
                      event.target.value
                    )
                  }
                />

                <label>
                  Cover Letter
                </label>

                <textarea
                  rows="7"
                  placeholder="Write a short cover letter explaining why you are interested in this position..."
                  value={coverLetter}
                  onChange={(event) =>
                    setCoverLetter(
                      event.target.value
                    )
                  }
                />

                <div className="application-form-actions">

                  <button
                    type="button"
                    className="application-cancel-button"
                    onClick={() =>
                      setShowApplyForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="application-submit-button"
                    disabled={applying}
                  >
                    {applying
                      ? "Submitting..."
                      : "Submit Application"}
                  </button>

                </div>

              </form>
            )}

            {/* JOB META */}

            <div className="job-meta-grid">

              <div>
                <span>Location</span>
                <strong>
                  {job.location}
                </strong>
              </div>

              <div>
                <span>Job Type</span>
                <strong>
                  {job.type}
                </strong>
              </div>

              <div>
                <span>Salary</span>
                <strong>
                  {job.salary}
                </strong>
              </div>

              <div>
                <span>Work Mode</span>
                <strong>
                  {job.mode}
                </strong>
              </div>

            </div>

            {/* ABOUT */}

            <section className="job-details-section">

              <h2>
                About the Role
              </h2>

              <p>
                {job.description}
              </p>

            </section>

            {/* RESPONSIBILITIES */}

            <section className="job-details-section">

              <h2>
                Responsibilities
              </h2>

              <ul>

                {job.responsibilities.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </section>

            {/* REQUIREMENTS */}

            <section className="job-details-section">

              <h2>
                Requirements
              </h2>

              <div className="job-skills">

                {job.requirements.map(
                  (skill, index) => (
                    <span key={index}>
                      {skill}
                    </span>
                  )
                )}

              </div>

            </section>

          </div>

        </div>
      </main>
    </div>
  );
}

export default JobDetails;