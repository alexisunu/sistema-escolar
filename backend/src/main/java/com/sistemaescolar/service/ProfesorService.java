package com.sistemaescolar.service;

import com.sistemaescolar.model.Profesor;
import com.sistemaescolar.repository.ProfesorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfesorService {

    @Autowired
    private ProfesorRepository profesorRepository;

    public List<Profesor> getAll() {
        return profesorRepository.findAll();
    }

    public Optional<Profesor> getById(Long id) {
        return profesorRepository.findById(id);
    }

    public Profesor save(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    public void delete(Long id) {
        profesorRepository.deleteById(id);
    }
}
