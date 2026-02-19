package com.es.cinema.tickets.web.controller;

import com.es.cinema.tickets.application.service.SalaService;
import com.es.cinema.tickets.web.dto.response.SalaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/salas")
@RequiredArgsConstructor
public class SalaController {

    private final SalaService salaService;

    @GetMapping
    public ResponseEntity<List<SalaResponseDTO>> listarTodas() {
        return ResponseEntity.ok(salaService.listarTodas());
    }
}
