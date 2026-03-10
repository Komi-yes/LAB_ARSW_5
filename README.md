# Lab 5 — Collaborative Drawing Board

A real-time multi-user drawing board built with **React + p5.js** (frontend) and **Spring Boot** (backend).

---

## Architecture Overview

```
Browser Tab 1 (React)          Browser Tab 2 (React)
      │                               │
      │  POST /api/strokes            │  POST /api/strokes
      │  GET  /api/strokes (500ms)    │  GET  /api/strokes (500ms)
      └──────────────┬────────────────┘
                     ▼
            Spring Boot (port 8080)
             In-memory stroke list
```

Every user sends their drawing strokes to the backend.  
Every user polls the backend every 500ms to get all strokes and redraws the canvas.  
Clicking "Clear Board" sends DELETE to the backend — wiping all strokes for everyone.

---

## How to Run Locally

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- npm 9+

---

### 1. Start the Backend (Spring Boot)

```bash
cd collaborative-board\backend
mvn spring-boot:run
```

The server starts at **http://localhost:8080**

You can verify it works by opening: http://localhost:8080/api/strokes  
(Should return `[]` — an empty list)

---

### 2. Start the Frontend (React)

```bash
cd collaborative-board\frontend
npm install      # installs React, p5.js, etc.
npm start        # starts dev server at http://localhost:3000
```

Open **http://localhost:3000** in two or more browser tabs to draw together!

---

## API Reference

| Method   | Endpoint       | Description                              |
|----------|----------------|------------------------------------------|
| GET      | /api/strokes   | Returns all strokes (polled every 500ms) |
| POST     | /api/strokes   | Saves a new stroke point                 |
| DELETE   | /api/strokes   | Clears all strokes for everyone          |

### Stroke JSON format

```json
{
  "x": 123.4,
  "y": 456.7,
  "color": "#E63946",
  "userId": "user_k3f9az",
  "timestamp": 1712345678901
}
```

---

## Key Concepts Used (from Lab guide)

| Concept | Where used | Lab Reference |
|---|---|---|
| React State | Stroke list, user color | react.dev/learn/reacting-to-input-with-state |
| React Refs | p5 instance, strokesRef | react.dev/learn/referencing-values-with-refs |
| React Effects | Polling interval, p5 setup/cleanup | react.dev/learn/synchronizing-with-effects |
| p5.js in React | Instance mode in App.js | Lab examples in pages 2–3 |
| CORS | @CrossOrigin in BoardController | spring.io/guides/gs/rest-service-cors |

---

## Deploying to AWS EC2

1. Launch an EC2 instance (Amazon Linux 2 or Ubuntu)
2. Install Java 17 and Node.js on the instance
3. Copy your project files to the instance via SCP or git clone
4. Build the backend: `mvn package` → produces `target/board-0.0.1-SNAPSHOT.jar`
5. Run the backend: `java -jar target/board-0.0.1-SNAPSHOT.jar`
6. Build the frontend: `npm run build` → produces static files in `build/`
7. Serve the frontend with nginx or `npx serve -s dist -l 3000 &`
8. Update `API_URL` in `App.jsx` to point to your EC2 public IP:
   ```js
   const API_URL = 'http://<your-ec2-ip>:8080/api';
   ```
9. Open port 8080 and 3000 in your EC2 Security Group inbound rules

Reference: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html
