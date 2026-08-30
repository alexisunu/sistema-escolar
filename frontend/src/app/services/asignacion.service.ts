import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Materia } from '../models/materia.model';
import { AsignacionEstudianteMateria, AsignacionProfesorMateria } from '../models/asignacion.model';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private baseUrl = `${environment.apiUrl}/asignaciones`;

  constructor(private http: HttpClient) {}

  // POST /asignaciones/estudiante-materia
  asignarMateriaEstudiante(payload: AsignacionEstudianteMateria): Observable<AsignacionEstudianteMateria> {
    return this.http.post<AsignacionEstudianteMateria>(`${this.baseUrl}/estudiante-materia`, payload);
  }

  // DELETE /asignaciones/estudiante-materia/{id}
  quitarAsignacionEstudiante(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/estudiante-materia/${id}`);
  }

  // GET /asignaciones/estudiante/{id}/materias
  getMateriasDeEstudiante(estudianteId: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.baseUrl}/estudiante/${estudianteId}/materias`);
  }

  // POST /asignaciones/profesor-materia
  asignarMateriaProfesor(payload: AsignacionProfesorMateria): Observable<AsignacionProfesorMateria> {
    return this.http.post<AsignacionProfesorMateria>(`${this.baseUrl}/profesor-materia`, payload);
  }

  // DELETE /asignaciones/profesor-materia/{id}
  quitarAsignacionProfesor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/profesor-materia/${id}`);
  }

  // GET /asignaciones/profesor/{id}/materias
  getMateriasDeProfesor(profesorId: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.baseUrl}/profesor/${profesorId}/materias`);
  }
}
