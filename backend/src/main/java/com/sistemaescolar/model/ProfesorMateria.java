package com.sistemaescolar.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profesor_materia", uniqueConstraints = @UniqueConstraint(columnNames = {"profesor_id", "materia_id"}))
public class ProfesorMateria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profesor_id", nullable = false)
    private Profesor profesor;

    @ManyToOne
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    public ProfesorMateria() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Profesor getProfesor() { return profesor; }
    public void setProfesor(Profesor profesor) { this.profesor = profesor; }

    public Materia getMateria() { return materia; }
    public void setMateria(Materia materia) { this.materia = materia; }
}
