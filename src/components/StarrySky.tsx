import React, { useMemo } from "react";

interface StarrySkyProps {
  interactive?: boolean;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ interactive = true }) => {
  // Generate consistent starry layout
  const stars = useMemo(() => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      x: (i * 23) % 98 + 1,
      y: (i * 37) % 94 + 2,
      size: (i % 3) + 1.2,
      opacity: 0.25 + ((i * 7) % 65) / 100,
      duration: 3 + (i % 5),
      delay: (i % 4) * 0.7,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Deep night gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a17] via-[#091124] to-[#040813]" />

      {/* Subtle cosmic aura glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-900/15 blur-[90px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-600/10 blur-[100px]" />

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="#ffffff"
            opacity={star.opacity}
            style={{
              animation: `pulse ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Gentle constellation lines */}
        <line x1="18%" y1="22%" x2="26%" y2="28%" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <line x1="26%" y1="28%" x2="34%" y2="25%" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <line x1="72%" y1="16%" x2="80%" y2="20%" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
        <line x1="80%" y1="20%" x2="88%" y2="29%" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
      </svg>
    </div>
  );
};
