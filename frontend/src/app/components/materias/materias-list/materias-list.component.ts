import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Materia } from '../../../models/materia.model';
import { MateriaService } from '../../../services/materia.service';

@Component({
  standalone: false,
  selector: 'app-materias-list',
  templateUrl: './materias-list.component.html',
  styleUrls: ['./materias-list.component.css']
})
export class MateriasListComponent implements OnInit {
  materias: Materia[] = [];
  cargando = false;
  error = '';

  constructor(
    private materiaService: MateriaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.cargando = true;
    this.error = '';
    this.materiaService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar la lista de materias. Verifica que el backend esté disponible.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevaMateria(): void {
    this.router.navigate(['/materias/nuevo']);
  }

  editarMateria(id?: number): void {
    if (id != null) {
      this.router.navigate(['/materias/editar', id]);
    }
  }

  eliminarMateria(id?: number): void {
    if (id == null) return;
    if (!confirm('¿Seguro que deseas eliminar esta materia?')) return;

    this.materiaService.eliminarMateria(id).subscribe({
      next: () => this.cargarMaterias(),
      error: () => {
        this.error = 'No se pudo eliminar la materia.';
        this.cdr.detectChanges();
      }
    });
  }
}
