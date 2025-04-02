import { useState, ReactNode } from "react";
import "./Tooltip.scss";

// Example usage
// const App = () => {
//   return (
//     <div className="flex justify-center items-center h-screen">
//       <Tooltip content={<button className="p-2 bg-blue-500 text-white rounded">Hover Me</button>} tooltipText="This is a tooltip!" />
//     </div>
//   );
// };

export const Tooltip = ({ content, tooltipText }: { content: ReactNode, tooltipText: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    setPosition({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  return (
    <div
      className="tooltip__main"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {content}

      {visible && (
        <div
          className="tooltip__popup"
          style={{
            left: position.x,
            top: position.y,
            transform: "translateX(10px) translateY(10px)",
            pointerEvents: "none",
            position: "fixed",
          }}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};
