package com.sistemaescolar.controller;

import com.sistemaescolar.model.EstudianteMateria;
import com.sistemaescolar.model.Materia;
import com.sistemaescolar.model.ProfesorMateria;
import com.sistemaescolar.service.AsignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "http://<IP_LAN_PC3>")
public class AsignacionController {

    @Autowired
    private AsignacionService asignacionService;

    @PostMapping("/estudiante-materia")
    public EstudianteMateria asignarAEstudiante(@RequestBody Map<String, Long> body) {
        return asignacionService.asignarMateriaAEstudiante(body.get("estudianteId"), body.get("materiaId"));
    }

    @DeleteMapping("/estudiante-materia/{id}")
    public void quitarDeEstudiante(@PathVariable Long id) {
        asignacionService.quitarMateriaDeEstudiante(id);
    }

    @GetMapping("/estudiante/{id}/materias")
    public List<Materia> materiasDeEstudiante(@PathVariable Long id) {
        return asignacionService.getMateriasDeEstudiante(id);
    }

    @PostMapping("/profesor-materia")
    public ProfesorMateria asignarAProfesor(@RequestBody Map<String, Long> body) {
        return asignacionService.asignarMateriaAProfesor(body.get("profesorId"), body.get("materiaId"));
    }

    @DeleteMapping("/profesor-materia/{id}")
    public void quitarDeProfesor(@PathVariable Long id) {
        asignacionService.quitarMateriaDeProfesor(id);
    }

    @GetMapping("/profesor/{id}/materias")
    public List<Materia> materiasDeProfesor(@PathVariable Long id) {
        return asignacionService.getMateriasDeProfesor(id);
    }
}
