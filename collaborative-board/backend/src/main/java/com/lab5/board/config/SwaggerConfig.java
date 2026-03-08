package com.lab5.board.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SWAGGER CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 * Esta clase personaliza la metadata que aparece en la cabecera
 * de la interfaz visual de Swagger UI.
 *
 * Sin esta clase Swagger igual funciona, pero mostraría un título
 * genérico. Con esta clase puedes personalizar:
 *   - Título de la API
 *   - Descripción
 *   - Versión
 *   - Datos de contacto
 *
 * @Configuration  → le dice a Spring que esta clase declara Beans
 * @Bean           → registra el objeto OpenAPI en el contexto de Spring,
 *                   springdoc lo detecta y lo usa para generar la UI
 *
 * Una vez levantado el servidor puedes acceder a:
 *   Swagger UI  →  http://localhost:8080/swagger-ui.html
 *   JSON spec   →  http://localhost:8080/v3/api-docs
 */
@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI boardOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Collaborative Drawing Board API")
                        .description(
                                "API REST para el tablero de dibujo colaborativo en tiempo real. " +
                                        "Permite a múltiples usuarios dibujar simultáneamente enviando y " +
                                        "consultando trazos. Desarrollado con Spring Boot para el Lab 5."
                        )
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Lab 5 — Escuela Colombiana de Ingeniería")
                                .url("https://ldbn.is.escuelaing.edu.co")
                        )
                );
    }
}