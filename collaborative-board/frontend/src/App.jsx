import { useEffect, useRef } from 'react';
import p5 from 'p5';
import './App.css';

// ─────────────────────────────────────────────────────────────
// STEP 4 — Configuration
// ─────────────────────────────────────────────────────────────
// Base URL of our Spring Boot backend.
// In development both run locally on different ports.
// On AWS you'd change this to your EC2 public IP.
const API_URL = 'http://localhost:8080/api';

// Each user gets one of these colors based on a random index.
// This ensures different users get visually distinct colors.
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

// Generate a unique ID for this browser session.
// Math.random().toString(36) gives a short alphanumeric string like "k3f9az".
const USER_ID = 'user_' + Math.random().toString(36).substr(2, 9);

// Pick a color for this user (random from palette)
const USER_COLOR = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];

// ─────────────────────────────────────────────────────────────
// STEP 5 — The React Component
// ─────────────────────────────────────────────────────────────
function App() {

    /**
     * useRef is used here for two purposes:
     *
     * 1. myP5Ref → holds the p5 instance.
     *    We use a ref instead of state because we DON'T want React
     *    to re-render when the p5 instance is created. Refs persist
     *    across renders without triggering re-renders.
     *    (Lab reference: https://react.dev/learn/referencing-values-with-refs)
     *
     * 2. strokesRef → holds the latest strokes fetched from the server.
     *    p5's draw() loop runs independently of React's render cycle,
     *    so we can't use useState here — p5 would always see the initial
     *    value due to closure. A ref lets p5 always read the latest value.
     */
    const myP5Ref = useRef(null);
    const strokesRef = useRef([]);

    useEffect(() => {
        // ─────────────────────────────────────────────────────────
        // STEP 6 — The p5 Sketch
        // ─────────────────────────────────────────────────────────
        // This is the "instance mode" of p5 (required when used inside React).
        // Instead of global functions like setup() and draw(), everything is
        // scoped to the "p" parameter — so it doesn't pollute the global scope.
        const sketch = (p) => {

            // Track previous mouse position to draw connected lines (not just dots)
            let prevX = null;
            let prevY = null;
            let isDrawing = false;

            // ── p.setup: runs once when the sketch starts ──────────
            p.setup = function () {
                // createCanvas creates an HTML <canvas> element inside 'container' div
                const canvas = p.createCanvas(800, 550);
                canvas.parent('container');
                p.background(245, 245, 245); // light gray background
                p.strokeWeight(4);
                p.strokeCap(p.ROUND);       // round line caps look better
            };

            // ── p.draw: runs ~60 times per second ──────────────────
            p.draw = function () {

                // ── Redraw all strokes from the server ─────────────
                // Every frame we clear and redraw everything.
                // This is what makes other users' drawings appear on your canvas.
                p.background(245, 245, 245);
                p.noFill();

                const allStrokes = strokesRef.current;

                // Group strokes by userId so we can draw connected paths
                // (A path = consecutive strokes by the same user in sequence)
                const userPaths = {};
                allStrokes.forEach((stroke) => {
                    if (!userPaths[stroke.userId]) {
                        userPaths[stroke.userId] = [];
                    }
                    userPaths[stroke.userId].push(stroke);
                });

                // Draw each user's path as connected lines
                Object.values(userPaths).forEach((path) => {
                    if (path.length === 0) return;
                    p.stroke(path[0].color);
                    p.strokeWeight(4);
                    p.beginShape();
                    path.forEach((s) => p.vertex(s.x, s.y));
                    p.endShape();
                });

                // ── Capture new drawing from this user ─────────────
                if (p.mouseIsPressed && isMouseOverCanvas(p)) {
                    isDrawing = true;

                    // Send the stroke point to the Spring Boot backend via POST
                    // We do this inside draw() which runs ~60fps — but we only send
                    // when the mouse has actually moved (to avoid spamming the API)
                    if (p.mouseX !== prevX || p.mouseY !== prevY) {
                        sendStroke(p.mouseX, p.mouseY);
                        prevX = p.mouseX;
                        prevY = p.mouseY;
                    }
                } else {
                    // Mouse released — reset previous position
                    // Next stroke will start a new path
                    if (isDrawing) {
                        prevX = null;
                        prevY = null;
                        isDrawing = false;
                    }
                }
            };
        };

        // Create the p5 instance and attach it to the DOM div
        myP5Ref.current = new p5(sketch);

        // ─────────────────────────────────────────────────────────
        // STEP 7 — Polling the Backend (simulating real-time)
        // ─────────────────────────────────────────────────────────
        // Since we don't have WebSockets, we poll every 500ms.
        // This fetches all strokes from the server and updates strokesRef.
        // The p5 draw() loop reads from strokesRef, so it will show
        // everyone's drawings on the next frame.
        //
        // Lab reference: https://react.dev/learn/referencing-values-with-refs#example-building-a-stopwatch
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

        // ─────────────────────────────────────────────────────────
        // Cleanup when component unmounts
        // This prevents memory leaks — always clean up Effects!
        // Lab reference: https://react.dev/learn/synchronizing-with-effects
        // ─────────────────────────────────────────────────────────
        return () => {
            clearInterval(interval);
            if (myP5Ref.current) {
                myP5Ref.current.remove();
            }
        };
    }, []); // Empty dependency array = run this effect only once on mount

    // ─────────────────────────────────────────────────────────
    // STEP 8 — Helper: Send a stroke to the backend
    // ─────────────────────────────────────────────────────────
    // Called from inside p5's draw() loop.
    // Sends a POST request to Spring Boot with the stroke data.
    const sendStroke = async (x, y) => {
        const stroke = {
            x,
            y,
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

    // ─────────────────────────────────────────────────────────
    // STEP 9 — Clear Board
    // ─────────────────────────────────────────────────────────
    // Sends DELETE /api/strokes to the backend.
    // The backend clears the list, so ALL users' canvases go blank
    // on their next poll cycle (within 500ms).
    const clearBoard = async () => {
        try {
            await fetch(`${API_URL}/strokes`, { method: 'DELETE' });
            strokesRef.current = [];
        } catch (err) {
            console.error('Failed to clear board:', err);
        }
    };

    // ─────────────────────────────────────────────────────────
    // Helper: check if mouse is inside the canvas bounds
    // ─────────────────────────────────────────────────────────
    const isMouseOverCanvas = (p) => {
        return p.mouseX >= 0 && p.mouseX <= p.width &&
            p.mouseY >= 0 && p.mouseY <= p.height;
    };

    // ─────────────────────────────────────────────────────────
    // STEP 10 — Render the UI
    // ─────────────────────────────────────────────────────────
    return (
        <div className="app">
            <header className="header">
                <h1 className="title">🎨 Collaborative Board</h1>
                <div className="user-info">
          <span
              className="color-dot"
              style={{ backgroundColor: USER_COLOR }}
          />
                    <span className="user-label">You are drawing as <strong>{USER_ID}</strong></span>
                </div>
                <button className="clear-btn" onClick={clearBoard}>
                    🗑 Clear Board (for everyone)
                </button>
            </header>

            <div className="canvas-wrapper">
                {/* p5.js will inject the <canvas> element inside this div */}
                <div id="container" />
            </div>

            <footer className="footer">
                <p>Open this page in multiple browser tabs to draw together in real time!</p>
            </footer>
        </div>
    );
}

export default App;