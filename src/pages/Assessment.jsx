import { useState } from "react";
import { Link } from "react-router-dom";

const questions = [
  {
    question: "What type of work do you enjoy most?",
    options: [
      "Solving technical problems",
      "Analyzing data and finding patterns",
      "Designing and creating things",
      "Working with people and communication",
    ],
  },
  {
    question: "Which activity sounds most interesting to you?",
    options: [
      "Building an application",
      "Exploring data and statistics",
      "Creating a website or visual design",
      "Leading a team or project",
    ],
  },
  {
    question: "How do you usually approach a difficult problem?",
    options: [
      "Break it into smaller technical problems",
      "Study the information and identify patterns",
      "Try different creative approaches",
      "Discuss it with others and gather ideas",
    ],
  },
  {
    question: "Which skill would you most like to develop?",
    options: [
      "Programming and software development",
      "Artificial intelligence and machine learning",
      "UI/UX and creative technology",
      "Leadership and business",
    ],
  },
  {
    question: "What kind of environment would you prefer?",
    options: [
      "Technical and engineering focused",
      "Research and analytical",
      "Creative and collaborative",
      "Business and people focused",
    ],
  },
  {
    question: "Which project would you choose?",
    options: [
      "Build a full-stack web application",
      "Create a machine learning model",
      "Design a modern digital product",
      "Build a business or startup idea",
    ],
  },
  {
    question: "What motivates you most in your career?",
    options: [
      "Building useful technology",
      "Discovering insights and solving complex problems",
      "Creating something unique",
      "Making decisions and influencing outcomes",
    ],
  },
  {
    question: "Which statement describes you best?",
    options: [
      "I enjoy logical and technical challenges",
      "I am curious about data and intelligent systems",
      "I enjoy creativity and visual thinking",
      "I enjoy communication and leadership",
    ],
  },
];

/*
  Each option has:
  [AI/ML points, Data Scientist points, Software Engineer points]
*/
const scoring = [
  [
    [1, 0, 3],
    [2, 3, 1],
    [2, 0, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [2, 3, 1],
    [1, 0, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [2, 3, 1],
    [3, 0, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [3, 2, 1],
    [2, 0, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [2, 3, 1],
    [2, 0, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [3, 2, 1],
    [2, 0, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [3, 3, 1],
    [2, 1, 1],
    [1, 1, 0],
  ],

  [
    [1, 0, 3],
    [3, 3, 1],
    [2, 0, 1],
    [1, 1, 0],
  ],
];

const calculateScores = (answers) => {
  let aiMl = 0;
  let dataScientist = 0;
  let softwareEngineer = 0;

  answers.forEach((answer, questionIndex) => {
    if (answer === null) {
      return;
    }

    const points = scoring[questionIndex][answer];

    aiMl += points[0];
    dataScientist += points[1];
    softwareEngineer += points[2];
  });

  const maxScore = 24;

  return {
    aiMlScore: Math.min(
      100,
      Math.round(50 + (aiMl / maxScore) * 50)
    ),

    dataScientistScore: Math.min(
      100,
      Math.round(50 + (dataScientist / maxScore) * 50)
    ),

    softwareEngineerScore: Math.min(
      100,
      Math.round(50 + (softwareEngineer / maxScore) * 50)
    ),
  };
};

function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState(
    Array(questions.length).fill(null)
  );

  const [showResults, setShowResults] = useState(false);

  const [results, setResults] = useState({
    aiMlScore: 0,
    dataScientistScore: 0,
    softwareEngineerScore: 0,
  });

  const [savingAssessment, setSavingAssessment] =
    useState(false);

  const [saveError, setSaveError] = useState("");

  const question = questions[currentQuestion];

  const handleAnswer = (answerIndex) => {
    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = answerIndex;

    setAnswers(updatedAnswers);
  };

  const handleNext = async () => {
    if (answers[currentQuestion] === null) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    const calculatedScores = calculateScores(answers);

    setResults(calculatedScores);
    setSavingAssessment(true);
    setSaveError("");

    try {
      const storedUser = JSON.parse(
        localStorage.getItem("careerbridgeUser") || "{}"
      );

      if (!storedUser.id) {
        throw new Error(
          "User information not found. Please login again."
        );
      }

      const response = await fetch(
        "https://careerbridge-backend-rw9x.onrender.com/api/assessment/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: storedUser.id,
            aiMlScore: calculatedScores.aiMlScore,
            dataScientistScore:
              calculatedScores.dataScientistScore,
            softwareEngineerScore:
              calculatedScores.softwareEngineerScore,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save assessment");
      }

      await response.json();

      setShowResults(true);
    } catch (error) {
      console.error(error);

      setSaveError(
        "Assessment completed, but the result could not be saved."
      );

      setShowResults(true);
    } finally {
      setSavingAssessment(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setAnswers(Array(questions.length).fill(null));

    setCurrentQuestion(0);

    setShowResults(false);

    setResults({
      aiMlScore: 0,
      dataScientistScore: 0,
      softwareEngineerScore: 0,
    });

    setSaveError("");
  };

  const careerResults = [
    {
      key: "aiMlScore",
      title: "AI / ML Engineer",
      score: results.aiMlScore,
      icon: "AI",
      description:
        "Build intelligent systems, work with data, and develop machine learning solutions.",
    },
    {
      key: "dataScientistScore",
      title: "Data Scientist",
      score: results.dataScientistScore,
      icon: "DS",
      description:
        "Analyze complex datasets and turn information into meaningful insights.",
    },
    {
      key: "softwareEngineerScore",
      title: "Software Engineer",
      score: results.softwareEngineerScore,
      icon: "SE",
      description:
        "Design, build and maintain software products that solve real-world problems.",
    },
  ];

  const topCareer = [...careerResults].sort(
    (a, b) => b.score - a.score
  )[0];

  if (showResults) {
    return (
      <div className="assessment-page">

        <header className="assessment-topbar">

          <Link
            to="/dashboard"
            className="assessment-brand"
          >
            <div className="brand-mark">
              C
            </div>

            <div className="brand-text">
              <span>Career</span>Bridge
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="assessment-exit"
          >
            Back to Dashboard
          </Link>

        </header>

        <main className="assessment-results">

          <div className="results-icon">
            ✦
          </div>

          <span className="assessment-eyebrow">
            ASSESSMENT COMPLETE
          </span>

          <h1>
            Your career direction
            <br />
            is becoming clearer.
          </h1>

          <p className="results-intro">
            Based on your responses, CareerBridge has
            identified several career areas that align
            with your interests and strengths.
          </p>

          {saveError && (
            <p className="assessment-save-error">
              {saveError}
            </p>
          )}

          <div className="results-grid">

            {careerResults.map((career) => (
              <div
                key={career.key}
                className={`result-card ${
                  career.key === topCareer.key
                    ? "result-primary"
                    : ""
                }`}
              >

                <div className="result-card-top">

                  <span>
                    {career.key === topCareer.key
                      ? "TOP CAREER MATCH"
                      : "CAREER MATCH"}
                  </span>

                  <strong>
                    {career.score}%
                  </strong>

                </div>

                <div className="result-career-icon">
                  {career.icon}
                </div>

                <h2>
                  {career.title}
                </h2>

                <p>
                  {career.description}
                </p>

                <Link to="/learning">
                  Explore learning path →
                </Link>

              </div>
            ))}

          </div>

          <div className="results-actions">

            <Link
              to="/dashboard"
              className="assessment-primary-button"
            >
              Go to Dashboard →
            </Link>

            <button
              onClick={handleRestart}
              className="assessment-secondary-button"
            >
              Retake Assessment
            </button>

          </div>

        </main>

      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-page">

      {/* TOP BAR */}

      <header className="assessment-topbar">

        <Link
          to="/dashboard"
          className="assessment-brand"
        >
          <div className="brand-mark">
            C
          </div>

          <div className="brand-text">
            <span>Career</span>Bridge
          </div>
        </Link>

        <div className="assessment-progress-info">

          <span>
            Career Assessment
          </span>

          <strong>
            {currentQuestion + 1} / {questions.length}
          </strong>

        </div>

        <Link
          to="/dashboard"
          className="assessment-exit"
        >
          Exit
        </Link>

      </header>

      {/* PROGRESS */}

      <div className="assessment-progress">

        <div
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* CONTENT */}

      <main className="assessment-content">

        <div className="assessment-intro">

          <span className="assessment-eyebrow">
            DISCOVER YOUR DIRECTION
          </span>

          <h1>
            Let's understand
            <br />
            what drives you.
          </h1>

          <p>
            Answer honestly. There are no right or wrong
            answers. Your responses help us understand
            your interests and career preferences.
          </p>

        </div>

        {/* QUESTION CARD */}

        <div className="question-card">

          <div className="question-number">
            QUESTION{" "}
            {String(currentQuestion + 1).padStart(2, "0")}
          </div>

          <h2>
            {question.question}
          </h2>

          <div className="answer-options">

            {question.options.map((option, index) => (

              <button
                key={option}
                className={`answer-option ${
                  answers[currentQuestion] === index
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  handleAnswer(index)
                }
              >

                <span className="answer-letter">
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="answer-text">
                  {option}
                </span>

                <span className="answer-check">
                  ✓
                </span>

              </button>

            ))}

          </div>

          <div className="question-navigation">

            <button
              className="question-back"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            <span>
              {
                answers.filter(
                  (answer) => answer !== null
                ).length
              }{" "}
              of {questions.length} answered
            </span>

            <button
              className="question-next"
              onClick={handleNext}
              disabled={
                answers[currentQuestion] === null ||
                savingAssessment
              }
            >

              {currentQuestion === questions.length - 1
                ? savingAssessment
                  ? "Saving..."
                  : "View Results"
                : "Next Question"}

              <span>
                →
              </span>

            </button>

          </div>

        </div>

        {/* TIP */}

        <div className="assessment-tip">

          <span>
            ✦
          </span>

          <div>

            <strong>
              A quick tip
            </strong>

            <p>
              Choose the answer that feels most natural
              to you rather than what you think sounds best.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Assessment;