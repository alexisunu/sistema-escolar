import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from '../../../models/profesor.model';
import { ProfesorService } from '../../../services/profesor.service';

@Component({
  standalone: false,
  selector: 'app-profesor-form',
  templateUrl: './profesor-form.component.html',
  styleUrls: ['./profesor-form.component.css']
})
export class ProfesorFormComponent implements OnInit {
  profesor: Profesor = {
    nombre: '',
    apellido: '',
    email: '',
    especialidad: ''
  };

  modoEdicion = false;
  guardando = false;
  error = '';

  constructor(
    private profesorService: ProfesorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.profesorService.getProfesor(+id).subscribe({
        next: (data) => (this.profesor = data),
        error: () => (this.error = 'No se pudo cargar el profesor.')
      });
    }
  }

  guardar(): void {
    this.guardando = true;
    this.error = '';

    const peticion = this.modoEdicion && this.profesor.id
      ? this.profesorService.actualizarProfesor(this.profesor.id, this.profesor)
      : this.profesorService.crearProfesor(this.profesor);

    peticion.subscribe({
      next: () => this.router.navigate(['/profesores']),
      error: () => {
        this.error = 'No se pudo guardar el profesor.';
        this.guardando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/profesores']);
  }
}
