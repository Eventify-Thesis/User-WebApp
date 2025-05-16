import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ConfettiEffect: React.FC = () => {
  useEffect(() => {
    // fire a burst of confetti when the component mounts
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      zIndex: 9999,
    });
    // Optionally, you can run more bursts or a timer here
  }, []);

  return null;
};

export default ConfettiEffect;
