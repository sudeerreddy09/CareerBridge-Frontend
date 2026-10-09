import Navbar from "../components/Navbar";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";


function Home() {
  return (
    <div className="home-page">

      <Navbar />

      {/* HERO */}
      <section className="hero">

        <div className="hero-background">
          <div className="hero-orb orb-one"></div>
          <div className="hero-orb orb-two"></div>
        </div>

        <div className="hero-content">

          <div className="hero-badge">
            <span className="badge-dot"></span>
            Your career journey starts here
          </div>

          <h1>
            Build the career
            <br />
            <span>you were meant for.</span>
          </h1>

          <p>
            CareerBridge brings career discovery, skill development,
            learning resources and job opportunities together in one
            intelligent platform.
          </p>

          <div className="hero-actions">
            <Button to="/register">
              Start Your Journey
              <span>→</span>
            </Button>

            <Button to="/login" variant="secondary">
              Explore Platform
            </Button>
          </div>

          <div className="hero-trust">

            <div className="trust-avatars">
              <div>SR</div>
              <div>AK</div>
              <div>PM</div>
              <div>+</div>
            </div>

            <div>
              <strong>Start building your future</strong>
              <span>with CareerBridge</span>
            </div>

          </div>

        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-header">
              <div className="mini-brand">
                <div className="mini-logo">C</div>
                CareerBridge
              </div>

              <div className="preview-avatar">
                SR
              </div>
            </div>

            <div className="preview-body">

              <div className="preview-greeting">
                <span>Good morning,</span>
                <strong>Future Professional</strong>
              </div>

              <div className="preview-progress">

                <div>
                  <small>Career progress</small>
                  <strong>72%</strong>
                </div>

                <div className="progress-bar">
                  <div></div>
                </div>

              </div>

              <div className="preview-grid">

                <div className="mini-card">
                  <div className="mini-icon">✦</div>
                  <span>Assessment</span>
                  <strong>Discover</strong>
                </div>

                <div className="mini-card">
                  <div className="mini-icon">◆</div>
                  <span>Learning</span>
                  <strong>12 Courses</strong>
                </div>

                <div className="mini-card">
                  <div className="mini-icon">↗</div>
                  <span>Opportunities</span>
                  <strong>24 Matches</strong>
                </div>

                <div className="mini-card">
                  <div className="mini-icon">✓</div>
                  <span>Skills</span>
                  <strong>8 Completed</strong>
                </div>

              </div>

            </div>

          </div>

          <div className="floating-card floating-card-one">
            <span>Career Match</span>
            <strong>94%</strong>
            <small>Excellent fit</small>
          </div>

          <div className="floating-card floating-card-two">
            <span>New Opportunity</span>
            <strong>Software Engineer</strong>
            <small>Recommended for you</small>
          </div>

        </div>

      </section>

      {/* STATS */}
      <section className="stats-section">

        <div className="stats-container">

          <div className="stat">
            <strong>4+</strong>
            <span>Career tools</span>
          </div>

          <div className="stat">
            <strong>12+</strong>
            <span>Learning paths</span>
          </div>

          <div className="stat">
            <strong>24/7</strong>
            <span>Career access</span>
          </div>

          <div className="stat">
            <strong>1</strong>
            <span>Connected platform</span>
          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">

        <div className="section-heading">

          <div className="section-label">
            THE CAREERBRIDGE EXPERIENCE
          </div>

          <h2>
            Everything you need to
            <span> move forward.</span>
          </h2>

          <p>
            From discovering your strengths to finding the right
            opportunities, CareerBridge keeps your entire career
            journey connected.
          </p>

        </div>

        <div className="features-grid">

          <FeatureCard
            number="01"
            icon="✦"
            title="Career Assessment"
            description="Understand your interests, strengths and potential career paths."
            accent="feature-blue"
          />

          <FeatureCard
            number="02"
            icon="◆"
            title="Learning Resources"
            description="Build the skills employers are looking for through guided learning."
            accent="feature-purple"
          />

          <FeatureCard
            number="03"
            icon="↗"
            title="Job Opportunities"
            description="Discover opportunities aligned with your skills and career goals."
            accent="feature-green"
          />

          <FeatureCard
            number="04"
            icon="◎"
            title="Progress Tracking"
            description="Track your development and see how far you've come."
            accent="feature-orange"
          />

        </div>

      </section>

      {/* JOURNEY */}
      <section className="journey-section" id="journey">

        <div className="journey-content">

          <div className="section-label">
            YOUR CAREER JOURNEY
          </div>

          <h2>
            From uncertainty
            <br />
            to <span>direction.</span>
          </h2>

          <p>
            CareerBridge gives you a structured path to understand
            where you are, where you want to go and what you need
            to get there.
          </p>

          <Button to="/register">
            Begin Your Journey
            <span>→</span>
          </Button>

        </div>

        <div className="journey-steps">

          <div className="journey-step active">
            <div className="step-number">01</div>

            <div>
              <h3>Discover yourself</h3>
              <p>
                Understand your interests, strengths and career direction.
              </p>
            </div>
          </div>

          <div className="journey-line"></div>

          <div className="journey-step">
            <div className="step-number">02</div>

            <div>
              <h3>Build your skills</h3>
              <p>
                Follow learning paths designed around your goals.
              </p>
            </div>
          </div>

          <div className="journey-line"></div>

          <div className="journey-step">
            <div className="step-number">03</div>

            <div>
              <h3>Find opportunities</h3>
              <p>
                Connect your skills with meaningful opportunities.
              </p>
            </div>
          </div>

          <div className="journey-line"></div>

          <div className="journey-step">
            <div className="step-number">04</div>

            <div>
              <h3>Keep growing</h3>
              <p>
                Track your progress and continue developing your career.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="final-cta">

        <div className="cta-glow"></div>

        <div className="cta-content">

          <div className="section-label">
            YOUR FUTURE STARTS TODAY
          </div>

          <h2>
            Your career.
            <br />
            <span>Your next chapter.</span>
          </h2>

          <p>
            Stop wondering what comes next.
            Start building it.
          </p>

          <Button to="/register">
            Create Your CareerBridge Account
            <span>→</span>
          </Button>

        </div>

      </section>

      <Footer />

    </div>
  );
}

export default Home;