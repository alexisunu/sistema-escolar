import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estudiante } from '../../../models/estudiante.model';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  standalone: false,
  selector: 'app-estudiante-form',
  templateUrl: './estudiante-form.component.html',
  styleUrls: ['./estudiante-form.component.css']
})
export class EstudianteFormComponent implements OnInit {
  estudiante: Estudiante = {
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: ''
  };

  modoEdicion = false;
  guardando = false;
  error = '';

  constructor(
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.estudianteService.getEstudiante(+id).subscribe({
        next: (data) => (this.estudiante = data),
        error: () => (this.error = 'No se pudo cargar el estudiante.')
      });
    }
  }

  guardar(): void {
    this.guardando = true;
    this.error = '';

    const peticion = this.modoEdicion && this.estudiante.id
      ? this.estudianteService.actualizarEstudiante(this.estudiante.id, this.estudiante)
      : this.estudianteService.crearEstudiante(this.estudiante);

    peticion.subscribe({
      next: () => this.router.navigate(['/estudiantes']),
      error: () => {
        this.error = 'No se pudo guardar el estudiante.';
        this.guardando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/estudiantes']);
  }
}
