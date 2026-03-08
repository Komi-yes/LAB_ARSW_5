package com.lab5.board.model;

/**
 * A "Stroke" represents a single drawing point on the canvas.
 *
 * Fields:
 *  - x, y         : current pixel coordinates
 *  - prevX, prevY : previous pixel coordinates (null = start of a new mouse press)
 *  - color        : hex color string — unique per user session
 *  - userId       : identifies which user drew this stroke
 *  - timestamp    : when it was drawn
 *
 * WHY prevX / prevY?
 * ──────────────────
 * When prevX/prevY are null it means this stroke is the FIRST point
 * of a new mouse click → the frontend renders a dot (ellipse).
 *
 * When prevX/prevY have values it means the mouse was already pressed
 * and dragged → the frontend renders a line from (prevX,prevY) to (x,y).
 *
 * This is what prevents two separate clicks from being connected
 * with an unwanted straight line.
 */
public class Stroke {

    private double x;
    private double y;

    // Nullable — null means "start of a new stroke segment"
    private Double prevX;
    private Double prevY;

    private String color;
    private String userId;
    private long timestamp;

    // Default constructor required by Jackson (JSON deserializer)
    public Stroke() {}

    public Stroke(double x, double y, Double prevX, Double prevY,
                  String color, String userId, long timestamp) {
        this.x = x;
        this.y = y;
        this.prevX = prevX;
        this.prevY = prevY;
        this.color = color;
        this.userId = userId;
        this.timestamp = timestamp;
    }

    // Getters & Setters

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public Double getPrevX() { return prevX; }
    public void setPrevX(Double prevX) { this.prevX = prevX; }

    public Double getPrevY() { return prevY; }
    public void setPrevY(Double prevY) { this.prevY = prevY; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
