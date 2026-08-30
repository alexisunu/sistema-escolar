import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profesor } from '../../../models/profesor.model';
import { ProfesorService } from '../../../services/profesor.service';

@Component({
  standalone: false,
  selector: 'app-profesores-list',
  templateUrl: './profesores-list.component.html',
  styleUrls: ['./profesores-list.component.css']
})
export class ProfesoresListComponent implements OnInit {
  profesores: Profesor[] = [];
  cargando = false;
  error = '';

  constructor(
    private profesorService: ProfesorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.cargando = true;
    this.error = '';
    this.profesorService.getProfesores().subscribe({
      next: (data) => {
        this.profesores = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de profesores. Verifica que el backend esté disponible.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevoProfesor(): void {
    this.router.navigate(['/profesores/nuevo']);
  }

  editarProfesor(id?: number): void {
    if (id != null) {
      this.router.navigate(['/profesores/editar', id]);
    }
  }

  eliminarProfesor(id?: number): void {
    if (id == null) return;
    if (!confirm('¿Seguro que deseas eliminar este profesor?')) return;

    this.profesorService.eliminarProfesor(id).subscribe({
      next: () => this.cargarProfesores(),
      error: () => {
        this.error = 'No se pudo eliminar el profesor.';
        this.cdr.detectChanges();
      }
    });
  }
}
