package com.sistemaescolar.service;

import com.sistemaescolar.model.Materia;
import com.sistemaescolar.repository.MateriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaService {

    @Autowired
    private MateriaRepository materiaRepository;

    public List<Materia> getAll() {
        return materiaRepository.findAll();
    }

    public Optional<Materia> getById(Long id) {
        return materiaRepository.findById(id);
    }

    public Materia save(Materia materia) {
        return materiaRepository.save(materia);
    }

    public void delete(Long id) {
        materiaRepository.deleteById(id);
    }
}
