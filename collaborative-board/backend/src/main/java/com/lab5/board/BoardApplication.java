package com.lab5.board;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * STEP 3 — Application Entry Point
 *
 * @SpringBootApplication is a shortcut annotation that enables:
 *  - @Configuration: marks this as a config class
 *  - @EnableAutoConfiguration: auto-configures Spring (web server, JSON, etc.)
 *  - @ComponentScan: scans the package for controllers, services, etc.
 *
 * Running this class starts an embedded Tomcat server on port 8080.
 */
@SpringBootApplication
public class BoardApplication {
    public static void main(String[] args) {
        SpringApplication.run(BoardApplication.class, args);
    }
}
