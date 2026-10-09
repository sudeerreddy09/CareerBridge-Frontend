import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Learning from "./pages/Learning";
import Jobs from "./pages/Jobs";
import SavedJobs from "./pages/SavedJobs";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Course from "./pages/Course";
import JobDetails from "./pages/JobDetails";
import Portfolio from "./pages/Portfolio";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/assessment"
          element={<Assessment />}
        />

        <Route
          path="/learning"
          element={<Learning />}
        />

        <Route
          path="/learning/course/:id"
          element={<Course />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />
        <Route
  path="/applications"
  element={<Applications />}
/>

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/saved-jobs"
          element={<SavedJobs />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />
        <Route path="/notifications" element={<Notifications />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;