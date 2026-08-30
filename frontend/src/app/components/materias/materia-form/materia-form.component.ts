import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Materia } from '../../../models/materia.model';
import { MateriaService } from '../../../services/materia.service';

@Component({
  standalone: false,
  selector: 'app-materia-form',
  templateUrl: './materia-form.component.html',
  styleUrls: ['./materia-form.component.css']
})
export class MateriaFormComponent implements OnInit {
  materia: Materia = {
    nombre: '',
    descripcion: '',
    creditos: 0
  };

  modoEdicion = false;
  guardando = false;
  error = '';

  constructor(
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.materiaService.getMateria(+id).subscribe({
        next: (data) => {
          this.materia = data;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'No se pudo cargar la materia.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  guardar(): void {
    this.guardando = true;
    this.error = '';

    const peticion = this.modoEdicion && this.materia.id
      ? this.materiaService.actualizarMateria(this.materia.id, this.materia)
      : this.materiaService.crearMateria(this.materia);

    peticion.subscribe({
      next: () => this.router.navigate(['/materias']),
      error: () => {
        this.error = 'No se pudo guardar la materia.';
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/materias']);
  }
}
