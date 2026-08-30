import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Estudiante } from '../../../models/estudiante.model';
import { Profesor } from '../../../models/profesor.model';
import { Materia } from '../../../models/materia.model';
import { EstudianteService } from '../../../services/estudiante.service';
import { ProfesorService } from '../../../services/profesor.service';
import { MateriaService } from '../../../services/materia.service';
import { AsignacionService } from '../../../services/asignacion.service';

@Component({
  standalone: false,
  selector: 'app-asignacion-form',
  templateUrl: './asignacion-form.component.html',
  styleUrls: ['./asignacion-form.component.css']
})
export class AsignacionFormComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  profesores: Profesor[] = [];
  materias: Materia[] = [];

  // Estudiante <-> Materia
  estudianteSeleccionado: number | null = null;
  materiaParaEstudiante: number | null = null;
  materiasDelEstudiante: Materia[] = [];

  // Profesor <-> Materia
  profesorSeleccionado: number | null = null;
  materiaParaProfesor: number | null = null;
  materiasDelProfesor: Materia[] = [];

  mensaje = '';
  error = '';

  constructor(
    private estudianteService: EstudianteService,
    private profesorService: ProfesorService,
    private materiaService: MateriaService,
    private asignacionService: AsignacionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.cdr.detectChanges();
      }
    });
    this.profesorService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data;
        this.cdr.detectChanges();
      }
    });
    this.materiaService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Estudiante <-> Materia ---

  cargarMateriasDelEstudiante(): void {
    if (this.estudianteSeleccionado == null) {
      this.materiasDelEstudiante = [];
      return;
    }
    this.asignacionService.getMateriasDeEstudiante(this.estudianteSeleccionado).subscribe({
      next: (data) => {
        this.materiasDelEstudiante = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las materias del estudiante.';
        this.cdr.detectChanges();
      }
    });
  }

  asignarMateriaAEstudiante(): void {
    this.error = '';
    this.mensaje = '';
    if (this.estudianteSeleccionado == null || this.materiaParaEstudiante == null) {
      this.error = 'Selecciona un estudiante y una materia.';
      return;
    }

    this.asignacionService
      .asignarMateriaEstudiante({
        estudianteId: this.estudianteSeleccionado,
        materiaId: this.materiaParaEstudiante
      })
      .subscribe({
        next: () => {
          this.mensaje = 'Materia asignada al estudiante correctamente.';
          this.cargarMateriasDelEstudiante();
        },
        error: () => {
          this.error = 'No se pudo asignar la materia al estudiante.';
          this.cdr.detectChanges();
        }
      });
  }

  quitarAsignacionEstudiante(asignacionId?: number): void {
    if (asignacionId == null) return;
    this.asignacionService.quitarAsignacionEstudiante(asignacionId).subscribe({
      next: () => this.cargarMateriasDelEstudiante(),
      error: () => {
        this.error = 'No se pudo quitar la asignación.';
        this.cdr.detectChanges();
      }
    });
  }

  // --- Profesor <-> Materia ---

  cargarMateriasDelProfesor(): void {
    if (this.profesorSeleccionado == null) {
      this.materiasDelProfesor = [];
      return;
    }
    this.asignacionService.getMateriasDeProfesor(this.profesorSeleccionado).subscribe({
      next: (data) => {
        this.materiasDelProfesor = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las materias del profesor.';
        this.cdr.detectChanges();
      }
    });
  }

  asignarMateriaAProfesor(): void {
    this.error = '';
    this.mensaje = '';
    if (this.profesorSeleccionado == null || this.materiaParaProfesor == null) {
      this.error = 'Selecciona un profesor y una materia.';
      return;
    }

    this.asignacionService
      .asignarMateriaProfesor({
        profesorId: this.profesorSeleccionado,
        materiaId: this.materiaParaProfesor
      })
      .subscribe({
        next: () => {
          this.mensaje = 'Materia asignada al profesor correctamente.';
          this.cargarMateriasDelProfesor();
        },
        error: () => {
          this.error = 'No se pudo asignar la materia al profesor.';
          this.cdr.detectChanges();
        }
      });
  }

  quitarAsignacionProfesor(asignacionId?: number): void {
    if (asignacionId == null) return;
    this.asignacionService.quitarAsignacionProfesor(asignacionId).subscribe({
      next: () => this.cargarMateriasDelProfesor(),
      error: () => {
        this.error = 'No se pudo quitar la asignación.';
        this.cdr.detectChanges();
      }
    });
  }
}
