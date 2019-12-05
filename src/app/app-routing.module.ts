import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import the components so they can be referenced in routes
import { CreateEmployeeComponent } from './employee/create-employee.component';
import { ListEmployeesComponent } from './employee/list-employees.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found.component';


const routes: Routes = [
   // home route
   { path: 'home', component: HomeComponent },
   { path: 'list', component: ListEmployeesComponent },
   { path: 'create', component: CreateEmployeeComponent },
   { path: 'edit/:id', component: CreateEmployeeComponent },
   // redirect to the home route if the client side route path is empty
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   // wild card route
   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
