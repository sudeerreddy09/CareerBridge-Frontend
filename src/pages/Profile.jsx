import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Profile() {
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState({
    phone: "",
    location: "",
    careerGoal: "",
    bio: "",
    skills: "",
    githubUrl: "",
    linkedinUrl: "",

    // Education
    degree: "",
    college: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
  });

  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("careerbridgeUser");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const currentUser = JSON.parse(storedUser);

      setUser(currentUser);

      loadProfile(currentUser.id);
    } catch (error) {
      console.error(
        "Failed to read logged-in user:",
        error
      );

      localStorage.removeItem("careerbridgeUser");
      window.location.href = "/login";
    }
  }, []);

  const loadProfile = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/profile/user/${userId}`
      );

      if (response.ok) {
        const data = await response.json();

        const loadedProfile = {
          phone: data.phone || "",
          location: data.location || "",
          careerGoal: data.careerGoal || "",
          bio: data.bio || "",
          skills: data.skills || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",

          // Education
          degree: data.degree || "",
          college: data.college || "",
          branch: data.branch || "",
          graduationYear: data.graduationYear || "",
          cgpa: data.cgpa || "",
        };

        setProfile(loadedProfile);

        /*
          Keep the logged-in user information synchronized
          with the profile.

          Jobs.jsx uses careerbridgeUser.location for
          location-based job personalization.
        */
        const storedUser =
          localStorage.getItem("careerbridgeUser");

        if (storedUser) {
          const currentUser = JSON.parse(storedUser);

          const updatedUser = {
            ...currentUser,
            location: loadedProfile.location,
            careerGoal: loadedProfile.careerGoal,
          };

          localStorage.setItem(
            "careerbridgeUser",
            JSON.stringify(updatedUser)
          );

          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/profile/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            ...profile,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save profile"
        );
      }

      const savedProfile =
        await response.json();

      const updatedProfile = {
        phone: savedProfile.phone || "",
        location: savedProfile.location || "",
        careerGoal:
          savedProfile.careerGoal || "",
        bio: savedProfile.bio || "",
        skills: savedProfile.skills || "",
        githubUrl:
          savedProfile.githubUrl || "",
        linkedinUrl:
          savedProfile.linkedinUrl || "",

        // Education
        degree: savedProfile.degree || "",
        college: savedProfile.college || "",
        branch: savedProfile.branch || "",
        graduationYear:
          savedProfile.graduationYear || "",
        cgpa: savedProfile.cgpa || "",
      };

      setProfile(updatedProfile);

      /*
        Synchronize Profile information with the
        logged-in user stored in localStorage.

        This allows Jobs.jsx to use the real
        profile location when calculating
        personalized job matches.
      */
      const updatedUser = {
        ...user,
        location: updatedProfile.location,
        careerGoal: updatedProfile.careerGoal,
      };

      localStorage.setItem(
        "careerbridgeUser",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      setEditing(false);

      setMessage(
        "Profile saved successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Profile save error:",
        error
      );

      setMessage(
        "Failed to save profile."
      );
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div className="dashboard-loading">
            Loading profile...
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">

        <div className="page-header">
          <div>
            <p className="page-eyebrow">
              ACCOUNT
            </p>

            <h1>My Profile</h1>

            <p>
              Manage your personal information
              and career details.
            </p>
          </div>

          {!editing && (
            <button
              className="primary-button"
              onClick={() =>
                setEditing(true)
              }
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        <section className="profile-card">

          <div className="profile-card-header">

            <div className="profile-avatar">
              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <h2>{user.name}</h2>

              <p>{user.email}</p>
            </div>

          </div>

          <div className="profile-divider"></div>

          <div className="profile-form-grid">

            <div className="profile-field">
              <label>Full Name</label>

              <input
                type="text"
                value={user.name || ""}
                disabled
              />

              <small>
                Name is managed through
                your account.
              </small>
            </div>

            <div className="profile-field">
              <label>Email</label>

              <input
                type="email"
                value={user.email || ""}
                disabled
              />

              <small>
                Email is managed through
                your account.
              </small>
            </div>

            <div className="profile-field">
              <label>Phone</label>

              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="profile-value">
                  {profile.phone ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>Location</label>

              {editing ? (
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad"
                />
              ) : (
                <div className="profile-value">
                  {profile.location ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>Career Goal</label>

              {editing ? (
                <input
                  type="text"
                  name="careerGoal"
                  value={
                    profile.careerGoal
                  }
                  onChange={handleChange}
                  placeholder="e.g. Machine Learning Engineer"
                />
              ) : (
                <div className="profile-value">
                  {profile.careerGoal ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>Skills</label>

              {editing ? (
                <input
                  type="text"
                  name="skills"
                  value={profile.skills}
                  onChange={handleChange}
                  placeholder="Python, Java, SQL, Machine Learning"
                />
              ) : (
                <div className="profile-value">
                  {profile.skills ||
                    "Not added"}
                </div>
              )}
            </div>

            {/* ========================= */}
            {/* EDUCATION SECTION */}
            {/* ========================= */}

            <div className="profile-field profile-field-full">
              <div className="profile-section-title">
                <h3>Education</h3>

                <p>
                  Add your academic information
                  for your CareerBridge profile
                  and resume.
                </p>
              </div>
            </div>

            <div className="profile-field">
              <label>Degree</label>

              {editing ? (
                <input
                  type="text"
                  name="degree"
                  value={profile.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech"
                />
              ) : (
                <div className="profile-value">
                  {profile.degree ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>College / University</label>

              {editing ? (
                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                />
              ) : (
                <div className="profile-value">
                  {profile.college ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>Branch / Specialization</label>

              {editing ? (
                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                />
              ) : (
                <div className="profile-value">
                  {profile.branch ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>Graduation Year</label>

              {editing ? (
                <input
                  type="text"
                  name="graduationYear"
                  value={
                    profile.graduationYear
                  }
                  onChange={handleChange}
                  placeholder="e.g. 2027"
                />
              ) : (
                <div className="profile-value">
                  {profile.graduationYear ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>CGPA / Percentage</label>

              {editing ? (
                <input
                  type="text"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5 CGPA"
                />
              ) : (
                <div className="profile-value">
                  {profile.cgpa ||
                    "Not added"}
                </div>
              )}
            </div>

            {/* ========================= */}
            {/* BIO */}
            {/* ========================= */}

            <div className="profile-field profile-field-full">
              <label>Bio</label>

              {editing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell employers about yourself..."
                  rows="5"
                />
              ) : (
                <div className="profile-value profile-bio">
                  {profile.bio ||
                    "No bio added yet."}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>GitHub</label>

              {editing ? (
                <input
                  type="text"
                  name="githubUrl"
                  value={
                    profile.githubUrl
                  }
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              ) : (
                <div className="profile-value">
                  {profile.githubUrl ||
                    "Not added"}
                </div>
              )}
            </div>

            <div className="profile-field">
              <label>LinkedIn</label>

              {editing ? (
                <input
                  type="text"
                  name="linkedinUrl"
                  value={
                    profile.linkedinUrl
                  }
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              ) : (
                <div className="profile-value">
                  {profile.linkedinUrl ||
                    "Not added"}
                </div>
              )}
            </div>

          </div>

          {editing && (
            <div className="profile-actions">

              <button
                className="secondary-button"
                onClick={() => {
                  setEditing(false);
                  setMessage("");
                }}
              >
                Cancel
              </button>

              <button
                className="primary-button"
                onClick={handleSave}
              >
                Save Profile
              </button>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Profile;