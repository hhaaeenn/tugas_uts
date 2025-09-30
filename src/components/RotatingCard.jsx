import React, { useState, useEffect } from "react";

export default function RotatingCard({ children, speed = 0.1, axis = "Y" }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setRotation((prevRotation) => (prevRotation + speed) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  const transformStyle = `perspective(1000px) rotate${axis}(${rotation}deg)`;

  return (
    <div
      className="transform-gpu transition-transform duration-0" // duration-0 agar transisi dikontrol oleh state
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
}
