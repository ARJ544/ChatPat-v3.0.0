// components/Loader.js
"use client"
import React from "react";
import PropTypes from "prop-types";

const Loader = ({ dotColor = "#6c5ce7", dotSize = 15, dotMargin = 5 }) => {
  const dots = [0, 1, 2];

  return (
    <div style={styles.container}>
      {dots.map((_, i) => (
        <div
          key={i}
          style={{
            ...styles.dot,
            backgroundColor: dotColor,
            width: dotSize,
            height: dotSize,
            margin: dotMargin,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // full screen
  },
  dot: {
    borderRadius: "50%",
    animation: "bounce 1.4s infinite ease-in-out both",
  },
};

Loader.propTypes = {
  dotColor: PropTypes.string,
  dotSize: PropTypes.number,
  dotMargin: PropTypes.number,
};

export default Loader;
