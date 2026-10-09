function FeatureCard({
  number,
  icon,
  title,
  description,
  accent,
}) {
  return (
    <div className={`feature-card ${accent || ""}`}>

      <div className="feature-top">
        <span className="feature-number">
          {number}
        </span>

        <div className="feature-icon">
          {icon}
        </div>
      </div>

      <div className="feature-content">
        <h3>{title}</h3>

        <p>{description}</p>

        <span className="feature-arrow">
          →
        </span>
      </div>

    </div>
  );
}

export default FeatureCard;