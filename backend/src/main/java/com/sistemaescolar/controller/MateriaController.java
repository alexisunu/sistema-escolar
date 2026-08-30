package com.sistemaescolar.controller;

import com.sistemaescolar.model.Materia;
import com.sistemaescolar.service.MateriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    @Autowired
    private MateriaService materiaService;

    @GetMapping
    public List<Materia> getAll() {
        return materiaService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Materia> getById(@PathVariable Long id) {
        Optional<Materia> materia = materiaService.getById(id);
        return materia.isPresent() ? ResponseEntity.ok(materia.get()) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public Materia create(@RequestBody Materia materia) {
        return materiaService.save(materia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Materia> update(@PathVariable Long id, @RequestBody Materia datos) {
        if (materiaService.getById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        datos.setId(id);
        return ResponseEntity.ok(materiaService.save(datos));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        materiaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
