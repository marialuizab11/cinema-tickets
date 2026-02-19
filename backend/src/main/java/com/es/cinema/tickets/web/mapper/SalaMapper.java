package com.es.cinema.tickets.web.mapper;

import com.es.cinema.tickets.persistence.entity.Sala;
import com.es.cinema.tickets.web.dto.response.SalaResponseDTO;

public class SalaMapper {

    private SalaMapper() {
    }

    public static SalaResponseDTO toResponseDTO(Sala sala) {
        return SalaResponseDTO.builder()
                .id(sala.getId())
                .numero(sala.getNumero())
                .capacidade(sala.getCapacidade())
                .build();
    }
}
