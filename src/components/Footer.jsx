function Footer() {
  return (
    <footer className="footer" id="about">

      <div className="footer-main">

        <div className="footer-brand">
          <div className="footer-logo">
            <div className="brand-mark">C</div>

            <div className="brand-text">
              <span>Career</span>Bridge
            </div>
          </div>

          <p>
            Connecting your skills, learning and
            career opportunities in one place.
          </p>
        </div>

        <div className="footer-column">
          <h4>Platform</h4>
          <a href="#features">Features</a>
          <a href="#journey">How It Works</a>
          <a href="#about">About Us</a>
        </div>

        <div className="footer-column">
          <h4>Career</h4>
          <a href="/assessment">Assessment</a>
          <a href="/learning">Learning</a>
          <a href="/jobs">Jobs</a>
        </div>

        <div className="footer-column">
          <h4>Account</h4>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          <a href="/profile">Profile</a>
        </div>

      </div>

      <div className="footer-bottom">
        <span>
          © 2026 CareerBridge. All rights reserved.
        </span>

        <span>
          Built for the next generation of professionals.
        </span>
      </div>

    </footer>
  );
}

export default Footer;