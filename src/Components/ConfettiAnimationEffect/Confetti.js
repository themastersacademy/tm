import { useEffect } from "react";

const Confetti = ({ trigger, origin }) => {
  useEffect(() => {
    if (!trigger) return; // Only trigger animation if prop is true

    // Function to load canvas-confetti and trigger animation
    const loadConfetti = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js";
        script.onload = () => {
          if (window.confetti) {
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: origin || { y: 0.6 }, // Use provided origin or fallback to default
              colors: ["#ff0", "#f00", "#0f0", "#00f"], // Yellow, Red, Green, Blue
            });
            resolve(true);
          } else {
            resolve(false);
          }
        };
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadConfetti();
  }, [trigger, origin]); // Re-run effect when trigger or origin changes

  return null; // This component doesn't render anything
};

export default Confetti;