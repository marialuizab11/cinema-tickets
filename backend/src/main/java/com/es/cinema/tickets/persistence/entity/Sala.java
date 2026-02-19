package com.es.cinema.tickets.persistence.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Entity
@Table(name = "salas")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false, unique = true)
    private Integer numero;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer capacidade;

    @Override
    public String toString() {
        return "Sala{id=" + id + ", numero=" + numero + ", capacidade=" + capacidade + "}";
    }

    @Override
    public final boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Sala other)) return false;
        return id != null && id.equals(other.id);
    }

    @Override
    public final int hashCode() {
        return (id != null) ? id.hashCode() : System.identityHashCode(this);
    }
}
