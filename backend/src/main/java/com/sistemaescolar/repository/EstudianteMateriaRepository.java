package com.sistemaescolar.repository;

import com.sistemaescolar.model.EstudianteMateria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EstudianteMateriaRepository extends JpaRepository<EstudianteMateria, Long> {
    List<EstudianteMateria> findByEstudianteId(Long estudianteId);
}
