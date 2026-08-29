import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { EstudiantesListComponent } from './components/estudiantes/estudiantes-list/estudiantes-list.component';
import { EstudianteFormComponent } from './components/estudiantes/estudiante-form/estudiante-form.component';
import { ProfesoresListComponent } from './components/profesores/profesores-list/profesores-list.component';
import { ProfesorFormComponent } from './components/profesores/profesor-form/profesor-form.component';
import { MateriasListComponent } from './components/materias/materias-list/materias-list.component';
import { MateriaFormComponent } from './components/materias/materia-form/materia-form.component';
import { AsignacionFormComponent } from './components/asignaciones/asignacion-form/asignacion-form.component';

@NgModule({
  declarations: [
    AppComponent,
    EstudiantesListComponent,
    EstudianteFormComponent,
    ProfesoresListComponent,
    ProfesorFormComponent,
    MateriasListComponent,
    MateriaFormComponent,
    AsignacionFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
