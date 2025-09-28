// components/Loader.js
"use client"
import React from "react";
import PropTypes from "prop-types";

const Loader = ({ dotSize = 15, dotMargin = 5, justifyContent = "center", alignItems = "center" }) => {
  const dots = [0, 1, 2];
  const styles = {
    dot: {
      borderRadius: "50%",
      animation: "bounce 1.4s infinite ease-in-out both",
    },
  };

  return (
    <div className={`flex justify-${justifyContent} items-${alignItems} h-screen`}>
      {dots.map((_, i) => (
        <div
          key={i}
          className="rounded-full bg-black dark:bg-white animate-bounce"
          style={{
            ...styles.dot,
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



Loader.propTypes = {
  dotColor: PropTypes.string,
  dotSize: PropTypes.number,
  dotMargin: PropTypes.number,
  justifyContent: PropTypes.string | null,
  alignItems: PropTypes.string | null
};

export default Loader;
