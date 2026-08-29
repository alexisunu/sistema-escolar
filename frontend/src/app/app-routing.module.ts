import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EstudiantesListComponent } from './components/estudiantes/estudiantes-list/estudiantes-list.component';
import { EstudianteFormComponent } from './components/estudiantes/estudiante-form/estudiante-form.component';
import { ProfesoresListComponent } from './components/profesores/profesores-list/profesores-list.component';
import { ProfesorFormComponent } from './components/profesores/profesor-form/profesor-form.component';
import { MateriasListComponent } from './components/materias/materias-list/materias-list.component';
import { MateriaFormComponent } from './components/materias/materia-form/materia-form.component';
import { AsignacionFormComponent } from './components/asignaciones/asignacion-form/asignacion-form.component';

const routes: Routes = [
  { path: '', redirectTo: 'estudiantes', pathMatch: 'full' },

  { path: 'estudiantes', component: EstudiantesListComponent },
  { path: 'estudiantes/nuevo', component: EstudianteFormComponent },
  { path: 'estudiantes/editar/:id', component: EstudianteFormComponent },

  { path: 'profesores', component: ProfesoresListComponent },
  { path: 'profesores/nuevo', component: ProfesorFormComponent },
  { path: 'profesores/editar/:id', component: ProfesorFormComponent },

  { path: 'materias', component: MateriasListComponent },
  { path: 'materias/nuevo', component: MateriaFormComponent },
  { path: 'materias/editar/:id', component: MateriaFormComponent },

  { path: 'asignaciones', component: AsignacionFormComponent },

  { path: '**', redirectTo: 'estudiantes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
