package com.sistemaescolar.service;

import com.sistemaescolar.model.*;
import com.sistemaescolar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AsignacionService {

    @Autowired
    private EstudianteMateriaRepository estudianteMateriaRepository;
    @Autowired
    private ProfesorMateriaRepository profesorMateriaRepository;
    @Autowired
    private EstudianteRepository estudianteRepository;
    @Autowired
    private ProfesorRepository profesorRepository;
    @Autowired
    private MateriaRepository materiaRepository;

    public EstudianteMateria asignarMateriaAEstudiante(Long estudianteId, Long materiaId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada"));

        EstudianteMateria em = new EstudianteMateria();
        em.setEstudiante(estudiante);
        em.setMateria(materia);
        return estudianteMateriaRepository.save(em);
    }

    public void quitarMateriaDeEstudiante(Long id) {
        estudianteMateriaRepository.deleteById(id);
    }

    public List<Materia> getMateriasDeEstudiante(Long estudianteId) {
        return estudianteMateriaRepository.findByEstudianteId(estudianteId)
                .stream().map(EstudianteMateria::getMateria).collect(Collectors.toList());
    }

    public ProfesorMateria asignarMateriaAProfesor(Long profesorId, Long materiaId) {
        Profesor profesor = profesorRepository.findById(profesorId)
                .orElseThrow(() -> new RuntimeException("Profesor no encontrado"));
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada"));

        ProfesorMateria pm = new ProfesorMateria();
        pm.setProfesor(profesor);
        pm.setMateria(materia);
        return profesorMateriaRepository.save(pm);
    }

    public void quitarMateriaDeProfesor(Long id) {
        profesorMateriaRepository.deleteById(id);
    }

    public List<Materia> getMateriasDeProfesor(Long profesorId) {
        return profesorMateriaRepository.findByProfesorId(profesorId)
                .stream().map(ProfesorMateria::getMateria).collect(Collectors.toList());
    }
}
