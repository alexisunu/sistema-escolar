import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Cada quien agrega aquí sus rutas a medida que crea sus componentes.
// Ejemplo: { path: 'estudiantes', component: EstudiantesList }
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
