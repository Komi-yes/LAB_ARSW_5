import { useEffect, useRef } from 'react';
import p5 from 'p5';
import './App.css';

const API_URL = 'http://localhost:8080/api';

const USER_COLORS = [
  '#E63946', // red
  '#2196F3', // blue
  '#4CAF50', // green
  '#FF9800', // orange
  '#9C27B0', // purple
  '#00BCD4', // cyan
  '#FF5722', // deep orange
  '#8BC34A', // light green
];

const USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

// ─────────────────────────────────────────────────────────────
// FIX 1 — Unique color per user
// ─────────────────────────────────────────────────────────────
// Instead of picking a fully random color (which could collide between users),
// we derive the color index FROM the userId using a simple hash function.
// This guarantees that:
//   - The SAME user always gets the SAME color (consistent across redraws)
//   - DIFFERENT users almost always get DIFFERENT colors
//
// How the hash works:
//   We loop over each character in the userId string, multiply the
//   accumulated value by 31 (a common prime used in hash functions)
//   and add the char code. The final modulo maps it into our palette range.
const hashUserId = (id) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % USER_COLORS.length;
  }
  return hash;
};

const USER_COLOR = USER_COLORS[hashUserId(USER_ID)];

function App() {
  const myP5Ref = useRef(null);
  const strokesRef = useRef([]);

  useEffect(() => {
    const sketch = (p) => {

      // ─────────────────────────────────────────────────────
      // FIX 2 — Track previous position PER mouse-press segment
      // ─────────────────────────────────────────────────────
      // prevX/prevY are set to null when the mouse is NOT pressed.
      // When the user presses and HOLDS the mouse, they accumulate.
      // When the mouse is released, they reset to null again.
      //
      // We pass prevX/prevY into each stroke we send to the backend.
      // This way the backend stores BOTH the current point AND where
      // to draw FROM — so we can render a line segment, not just a dot.
      //
      // If prevX/prevY are null it means this is the FIRST point of a
      // new mouse press → render a dot instead of a line.
      let prevX = null;
      let prevY = null;

      p.setup = function () {
        const canvas = p.createCanvas(800, 550);
        canvas.parent('container');
        p.background(245, 245, 245);
        p.strokeCap(p.ROUND);
      };

      p.draw = function () {
        p.background(245, 245, 245);

        const allStrokes = strokesRef.current;

        // ── Render all strokes from the server ──────────────
        // FIX 2 (rendering side):
        // Instead of grouping by userId and connecting ALL points with
        // beginShape/vertex (which caused the bug), we now render each
        // stroke individually using the prevX/prevY it carries:
        //
        //   stroke.prevX === null  →  first point of a new press → draw a dot
        //   stroke.prevX !== null  →  continuation of a drag    → draw a line
        //
        // This means two separate mouse clicks will NEVER be connected,
        // even if they belong to the same user.
        allStrokes.forEach((stroke) => {
          // Each stroke carries its own color → no grouping needed,
          // no path[0].color bug. Just read stroke.color directly.
          p.stroke(stroke.color);
          p.strokeWeight(4);
          p.fill(stroke.color);

          if (stroke.prevX === null || stroke.prevX === undefined) {
            // First point of a new mouse-press segment → draw a dot.
            // We draw a zero-length line instead of an ellipse so the dot
            // gets the exact same strokeWeight(4) and ROUND cap as every
            // other line segment — making all strokes visually consistent.
            p.noFill();
            p.line(stroke.x, stroke.y, stroke.x, stroke.y);
          } else {
            // Continuation of a drag → draw a line from previous to current
            p.noFill();
            p.line(stroke.prevX, stroke.prevY, stroke.x, stroke.y);
          }
        });

        // ── Capture new drawing from this user ──────────────
        if (p.mouseIsPressed && isMouseOverCanvas(p)) {
          if (p.mouseX !== prevX || p.mouseY !== prevY) {
            // Pass current prevX/prevY so the backend knows the context.
            // On first point of a press, prevX/prevY are null → backend
            // stores null → rendering draws a dot, no connecting line.
            sendStroke(p.mouseX, p.mouseY, prevX, prevY);
            prevX = p.mouseX;
            prevY = p.mouseY;
          }
        } else {
          // Mouse released → reset so the NEXT press starts fresh
          prevX = null;
          prevY = null;
        }
      };
    };

    myP5Ref.current = new p5(sketch);

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/strokes`);
        if (response.ok) {
          const data = await response.json();
          strokesRef.current = data;
        }
      } catch (err) {
        console.error('Failed to fetch strokes:', err);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (myP5Ref.current) {
        myP5Ref.current.remove();
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────
  // sendStroke now accepts prevX and prevY
  // ─────────────────────────────────────────────────────────
  // These are sent to the backend so every client can reconstruct
  // exactly where each line segment starts and ends.
  // When prevX/prevY are null (start of a new click), the backend
  // stores null and the renderer draws a dot instead of a line.
  const sendStroke = async (x, y, prevX, prevY) => {
    const stroke = {
      x,
      y,
      prevX: prevX,   // null if this is the first point of a new press
      prevY: prevY,   // null if this is the first point of a new press
      color: USER_COLOR,
      userId: USER_ID,
      timestamp: Date.now(),
    };
    try {
      await fetch(`${API_URL}/strokes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stroke),
      });
    } catch (err) {
      console.error('Failed to send stroke:', err);
    }
  };

  const clearBoard = async () => {
    try {
      await fetch(`${API_URL}/strokes`, { method: 'DELETE' });
      strokesRef.current = [];
    } catch (err) {
      console.error('Failed to clear board:', err);
    }
  };

  const isMouseOverCanvas = (p) => {
    return p.mouseX >= 0 && p.mouseX <= p.width &&
           p.mouseY >= 0 && p.mouseY <= p.height;
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">🎨 Collaborative Board</h1>
        <div className="user-info">
          <span className="color-dot" style={{ backgroundColor: USER_COLOR }} />
          <span className="user-label">
            Drawing as <strong>{USER_ID}</strong> in{' '}
            <strong style={{ color: USER_COLOR }}>this color</strong>
          </span>
        </div>
        <button className="clear-btn" onClick={clearBoard}>
          🗑 Clear Board (for everyone)
        </button>
      </header>

      <div className="canvas-wrapper">
        <div id="container" />
      </div>

      <footer className="footer">
        <p>Open this page in multiple browser tabs to draw together in real time!</p>
      </footer>
    </div>
  );
}

export default App;
