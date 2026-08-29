import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Materia } from '../models/materia.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private baseUrl = `${environment.apiUrl}/materias`;

  constructor(private http: HttpClient) {}

  // GET /materias
  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.baseUrl);
  }

  // GET /materias/{id}
  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.baseUrl}/${id}`);
  }

  // POST /materias
  crearMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(this.baseUrl, materia);
  }

  // PUT /materias/{id}
  actualizarMateria(id: number, materia: Materia): Observable<Materia> {
    return this.http.put<Materia>(`${this.baseUrl}/${id}`, materia);
  }

  // DELETE /materias/{id}
  eliminarMateria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
