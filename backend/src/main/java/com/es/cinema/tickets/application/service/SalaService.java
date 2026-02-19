package com.es.cinema.tickets.application.service;

import com.es.cinema.tickets.exception.notfound.SalaNotFoundException;
import com.es.cinema.tickets.persistence.entity.Sala;
import com.es.cinema.tickets.persistence.repository.SalaRepository;
import com.es.cinema.tickets.web.dto.response.SalaResponseDTO;
import com.es.cinema.tickets.web.mapper.SalaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaService {

    private final SalaRepository salaRepository;

    @Transactional(readOnly = true)
    public List<SalaResponseDTO> listarTodas() {
        return salaRepository.findAll()
                .stream()
                .map(SalaMapper::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public Sala buscarPorId(Long id) {
        return salaRepository.findById(id)
                .orElseThrow(() -> new SalaNotFoundException(id));
    }
}
