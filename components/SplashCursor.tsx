import React, { useState, useEffect } from 'react';

const DOT_COUNT = 10;
const STAGGER_MS = 20;

const SplashCursor: React.FC = () => {
  const [points, setPoints] = useState(Array(DOT_COUNT).fill({ x: -100, y: -100 }));
  const [isPointerVisible, setIsPointerVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch device on mount
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);

    if (hasTouch) return;
    
    // Hide default cursor
    document.body.style.cursor = 'none';

    // Show custom cursor after a delay
    const visibilityTimer = setTimeout(() => setIsPointerVisible(true), 500);

    const handleMouseMove = (e: MouseEvent) => {
      // Update the head of the trail immediately
      setPoints(prevPoints => {
        const newPoints = [...prevPoints];
        newPoints[0] = { x: e.clientX, y: e.clientY };
        return newPoints;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(visibilityTimer);
      document.body.style.cursor = 'auto'; // Restore default cursor on unmount
    };
  }, []);

  // Effect for the trailing dots
  useEffect(() => {
    if (isTouchDevice || !isPointerVisible) return;

    const timers = points.slice(1).map((_, index) => {
      return setTimeout(() => {
        setPoints(prevPoints => {
          const newPoints = [...prevPoints];
          // Each dot follows the one in front of it
          newPoints[index + 1] = newPoints[index];
          return newPoints;
        });
      }, (index + 1) * STAGGER_MS);
    });

    return () => timers.forEach(clearTimeout);
  }, [points, isTouchDevice, isPointerVisible]);

  if (isTouchDevice) {
    return null;
  }
  
  return (
    <div className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${isPointerVisible ? 'opacity-100' : 'opacity-0'}`}>
      {points.map((point, index) => {
        const isHead = index === 0;
        const scale = isHead ? 1 : (DOT_COUNT - index) / DOT_COUNT;
        const opacity = isHead ? 1 : 0.2 + (scale * 0.5);
        return (
          <div
            key={index}
            className="rounded-full absolute bg-lime-400"
            style={{
              top: `${point.y}px`,
              left: `${point.x}px`,
              width: `${isHead ? 10 : 8}px`,
              height: `${isHead ? 10 : 8}px`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: opacity,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
            }}
          />
        );
      })}
    </div>
  );
};

export default SplashCursor;
