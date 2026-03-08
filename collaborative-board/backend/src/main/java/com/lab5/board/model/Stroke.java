package com.lab5.board.model;

/**
 * STEP 1 — The Data Model
 *
 * A "Stroke" represents a single drawing point on the canvas.
 * Every time a user moves the mouse while drawing, the frontend
 * sends one of these objects to the backend.
 *
 * Fields:
 *  - x, y       : pixel coordinates on the canvas
 *  - color      : hex color string (e.g. "#FF5733") — unique per user
 *  - userId     : identifies which user drew this stroke
 *  - timestamp  : when it was drawn (useful for ordering)
 */
public class Stroke {

    private double x;
    private double y;
    private String color;
    private String userId;
    private long timestamp;

    // Default constructor required by Jackson (JSON serializer)
    public Stroke() {}

    public Stroke(double x, double y, String color, String userId, long timestamp) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.userId = userId;
        this.timestamp = timestamp;
    }

    // --- Getters & Setters ---

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}