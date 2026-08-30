import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Estudiante } from '../../../models/estudiante.model';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  standalone: false,
  selector: 'app-estudiantes-list',
  templateUrl: './estudiantes-list.component.html',
  styleUrls: ['./estudiantes-list.component.css']
})
export class EstudiantesListComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  cargando = false;
  error = '';

  constructor(
    private estudianteService: EstudianteService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.cargando = true;
    this.error = '';
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de estudiantes. Verifica que el backend esté disponible.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevoEstudiante(): void {
    this.router.navigate(['/estudiantes/nuevo']);
  }

  editarEstudiante(id?: number): void {
    if (id != null) {
      this.router.navigate(['/estudiantes/editar', id]);
    }
  }

  eliminarEstudiante(id?: number): void {
    if (id == null) return;
    if (!confirm('¿Seguro que deseas eliminar este estudiante?')) return;

    this.estudianteService.eliminarEstudiante(id).subscribe({
      next: () => this.cargarEstudiantes(),
      error: () => {
        this.error = 'No se pudo eliminar el estudiante.';
        this.cdr.detectChanges();
      }
    });
  }
}
