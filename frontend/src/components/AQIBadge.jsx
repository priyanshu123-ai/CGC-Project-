const AQIBadge = ({ value, size = "md" }) => {
  const getAQILevel = () => {
    if (value <= 50)
      return {
        label: "Good",
        color: "#22C55E",
        bgColor: "rgba(34, 197, 94, 0.15)",
      };

    if (value <= 100)
      return {
        label: "Moderate",
        color: "#EAB308",
        bgColor: "rgba(234, 179, 8, 0.15)",
      };

    if (value <= 150)
      return {
        label: "Unhealthy for Sensitive",
        color: "#F97316",
        bgColor: "rgba(249, 115, 22, 0.15)",
      };

    if (value <= 200)
      return {
        label: "Unhealthy",
        color: "#EF4444",
        bgColor: "rgba(239, 68, 68, 0.15)",
      };

    if (value <= 300)
      return {
        label: "Very Unhealthy",
        color: "#A855F7",
        bgColor: "rgba(168, 85, 247, 0.15)",
      };

    return {
      label: "Hazardous",
      color: "#881337",
      bgColor: "rgba(136, 19, 55, 0.15)",
    };
  };

  const { label, color, bgColor } = getAQILevel();

  const sizeStyles = {
    sm: { padding: "4px 8px", fontSize: "12px", gap: "4px" },
    md: { padding: "6px 12px", fontSize: "14px", gap: "6px" },
    lg: { padding: "8px 16px", fontSize: "16px", gap: "8px" },
  };

  const styles = sizeStyles[size];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: styles.gap,
        padding: styles.padding,
        borderRadius: "9999px",
        background: bgColor,
        border: `1px solid ${color}40`,
      }}
    >
      <div
        style={{
          width: size === "lg" ? "10px" : "8px",
          height: size === "lg" ? "10px" : "8px",
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
      <span style={{ fontSize: styles.fontSize, fontWeight: 600, color }}>
        {value}
      </span>
      <span style={{ fontSize: styles.fontSize, color: "#9CA3AF" }}>
        {label}
      </span>
    </div>
  );
};

export default AQIBadge;
