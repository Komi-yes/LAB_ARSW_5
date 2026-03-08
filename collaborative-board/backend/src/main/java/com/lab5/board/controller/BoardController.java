package com.lab5.board.controller;

import com.lab5.board.model.Stroke;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * STEP 2 — The REST Controller (the "brain" of the backend)
 *
 * Endpoints:
 *  GET  /api/strokes        → Returns ALL strokes stored in memory
 *  POST /api/strokes        → Receives a new stroke from a user and stores it
 *  DELETE /api/strokes      → Clears ALL strokes (the "erase board" action)
 *
 * @RestController = tells Spring this class handles HTTP requests and returns JSON
 * @RequestMapping = base path for all endpoints in this class
 * @CrossOrigin    = ENABLES CORS so React (port 3000) can call Spring (port 8080)
 *
 * SWAGGER ANNOTATIONS:
 * @Tag             → groups all endpoints of this controller under one section in Swagger UI
 * @Operation       → describes what each endpoint does (shows in Swagger UI)
 * @ApiResponses    → documents the possible HTTP response codes for each endpoint
 */
@Tag(
        name = "Board Controller",
        description = "Endpoints para gestionar los trazos del tablero colaborativo de dibujo"
)
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BoardController {

    /**
     * In-memory store for all strokes.
     * synchronizedList() makes it thread-safe when multiple users draw at the same time.
     */
    private final List<Stroke> strokes = Collections.synchronizedList(new ArrayList<>());

    /**
     * GET /api/strokes
     */
    @Operation(
            summary = "Obtener todos los trazos",
            description = "Retorna la lista completa de trazos dibujados por todos los usuarios. " +
                    "El frontend React llama este endpoint cada 500ms para mantener " +
                    "el canvas sincronizado en tiempo real."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de trazos retornada exitosamente")
    })
    @GetMapping("/strokes")
    public List<Stroke> getAllStrokes() {
        return strokes;
    }

    /**
     * POST /api/strokes
     */
    @Operation(
            summary = "Agregar un nuevo trazo",
            description = "Recibe un punto de dibujo (x, y, color, userId) desde el cliente React " +
                    "y lo almacena en memoria. Todos los demás usuarios verán este trazo " +
                    "en su próximo ciclo de polling (cada 500ms)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Trazo guardado y retornado exitosamente")
    })
    @PostMapping("/strokes")
    public Stroke addStroke(@RequestBody Stroke stroke) {
        strokes.add(stroke);
        return stroke;
    }

    /**
     * DELETE /api/strokes
     */
    @Operation(
            summary = "Borrar el tablero completo",
            description = "Elimina TODOS los trazos almacenados. Como todos los clientes pollan " +
                    "el mismo servidor, el tablero se borra para TODOS los usuarios " +
                    "en su siguiente ciclo de polling (máximo 500ms)."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tablero borrado exitosamente")
    })
    @DeleteMapping("/strokes")
    public String clearBoard() {
        strokes.clear();
        return "{\"message\": \"Board cleared\"}";
    }
}