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
  materias: Materia[] = [];

  // --- Estudiante <-> Materia ---
  idBusquedaEstudiante: string = '';
  estudianteEncontrado: Estudiante | null = null;
  errorBusquedaEstudiante = '';
  materiaParaEstudiante: number | null = null;
  materiasDelEstudiante: Materia[] = [];

  // --- Profesor <-> Materia ---
  idBusquedaProfesor: string = '';
  profesorEncontrado: Profesor | null = null;
  errorBusquedaProfesor = '';
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
    this.materiaService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Buscar estudiante por ID ---

  buscarEstudiante(): void {
    this.errorBusquedaEstudiante = '';
    this.estudianteEncontrado = null;
    this.materiasDelEstudiante = [];

    const id = Number(this.idBusquedaEstudiante);
    if (!this.idBusquedaEstudiante || isNaN(id)) {
      this.errorBusquedaEstudiante = 'Ingresa un ID válido.';
      return;
    }

    this.estudianteService.getEstudiante(id).subscribe({
      next: (data) => {
        this.estudianteEncontrado = data;
        this.cdr.detectChanges();
        this.cargarMateriasDelEstudiante();
      },
      error: () => {
        this.errorBusquedaEstudiante = 'No se encontró ningún estudiante con ese ID.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarMateriasDelEstudiante(): void {
    if (this.estudianteEncontrado?.id == null) return;
    this.asignacionService.getMateriasDeEstudiante(this.estudianteEncontrado.id).subscribe({
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
    if (this.estudianteEncontrado?.id == null || this.materiaParaEstudiante == null) {
      this.error = 'Busca un estudiante válido y selecciona una materia.';
      return;
    }

    this.asignacionService
      .asignarMateriaEstudiante({
        estudianteId: this.estudianteEncontrado.id,
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

  // --- Buscar profesor por ID ---

  buscarProfesor(): void {
    this.errorBusquedaProfesor = '';
    this.profesorEncontrado = null;
    this.materiasDelProfesor = [];

    const id = Number(this.idBusquedaProfesor);
    if (!this.idBusquedaProfesor || isNaN(id)) {
      this.errorBusquedaProfesor = 'Ingresa un ID válido.';
      return;
    }

    this.profesorService.getProfesor(id).subscribe({
      next: (data) => {
        this.profesorEncontrado = data;
        this.cdr.detectChanges();
        this.cargarMateriasDelProfesor();
      },
      error: () => {
        this.errorBusquedaProfesor = 'No se encontró ningún profesor con ese ID.';
        this.cdr.detectChanges();
      }
    });
  }

  cargarMateriasDelProfesor(): void {
    if (this.profesorEncontrado?.id == null) return;
    this.asignacionService.getMateriasDeProfesor(this.profesorEncontrado.id).subscribe({
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
    if (this.profesorEncontrado?.id == null || this.materiaParaProfesor == null) {
      this.error = 'Busca un profesor válido y selecciona una materia.';
      return;
    }

    this.asignacionService
      .asignarMateriaProfesor({
        profesorId: this.profesorEncontrado.id,
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
