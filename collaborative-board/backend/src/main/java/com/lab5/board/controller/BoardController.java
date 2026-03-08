package com.lab5.board.controller;

import com.lab5.board.model.Stroke;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * STEP 2 — The REST Controller (the "brain" of the backend)
 *
 * This is where HTTP requests from the React frontend are handled.
 *
 * Endpoints:
 *  GET  /api/strokes        → Returns ALL strokes stored in memory
 *  POST /api/strokes        → Receives a new stroke from a user and stores it
 *  DELETE /api/strokes      → Clears ALL strokes (the "erase board" action)
 *
 * @RestController = tells Spring this class handles HTTP requests and returns JSON
 * @RequestMapping = base path for all endpoints in this class
 * @CrossOrigin    = ENABLES CORS (Cross-Origin Resource Sharing)
 *                   Without this, the browser would BLOCK requests from
 *                   React (localhost:3000) to Spring (localhost:8080).
 *                   The lab's guide references: https://spring.io/guides/gs/rest-service-cors
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")  // Allow requests from any origin (React dev server)
public class BoardController {

    /**
     * In-memory store for all strokes.
     *
     * In a real production app this would be a database (PostgreSQL, MongoDB, etc.)
     * For this lab, we keep it simple: a thread-safe list in memory.
     * synchronizedList() makes it safe when multiple users send requests at the same time.
     */
    private final List<Stroke> strokes = Collections.synchronizedList(new ArrayList<>());

    /**
     * GET /api/strokes
     *
     * Called by every React client every 500ms (polling).
     * Returns the full list of strokes as JSON.
     * React uses this to redraw the canvas with everyone's drawings.
     */
    @GetMapping("/strokes")
    public List<Stroke> getAllStrokes() {
        return strokes;
    }

    /**
     * POST /api/strokes
     *
     * Called by React whenever a user draws a point on the canvas.
     * @RequestBody tells Spring to parse the JSON body into a Stroke object.
     * Returns the saved stroke as confirmation.
     */
    @PostMapping("/strokes")
    public Stroke addStroke(@RequestBody Stroke stroke) {
        strokes.add(stroke);
        return stroke;
    }

    /**
     * DELETE /api/strokes
     *
     * Called when ANY user clicks the "Clear Board" button.
     * Wipes all strokes — this affects ALL connected users
     * because they all poll the same list.
     *
     * Returns a simple message confirming the board was cleared.
     */
    @DeleteMapping("/strokes")
    public String clearBoard() {
        strokes.clear();
        return "{\"message\": \"Board cleared\"}";
    }
}