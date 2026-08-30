package com.sistemaescolar.repository;

import com.sistemaescolar.model.ProfesorMateria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfesorMateriaRepository extends JpaRepository<ProfesorMateria, Long> {
    List<ProfesorMateria> findByProfesorId(Long profesorId);
}
