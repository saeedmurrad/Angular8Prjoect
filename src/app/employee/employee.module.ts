// employee.module.ts
import { NgModule } from '@angular/core';
// Exports all the basic Angular directives and pipes
// such as NgIf, NgFor, DecimalPipe etc.
import { CommonModule } from '@angular/common';
// CreateEmployeeComponent uses ReactiveFormsModule directives such as
// formGroup so ReactiveFormsModule needs to be imported into this Module
// An alternative approach would be to create a Shared module and export
// the ReactiveFormsModule from it, so any other module that needs
// ReactiveFormsModule can import it from the SharedModule.
import { ReactiveFormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {RadioButton} from 'primeng/radiobutton';

// Import the EmployeeRoutingModule
import { EmployeeRoutingModule } from './employee-routing.module';

// Import and declare the components that belong to this Employee Module
import { CreateEmployeeComponent } from './create-employee.component';
import { ListEmployeesComponent } from './list-employees.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    ReactiveFormsModule,
    EmployeeRoutingModule
  ],
  declarations: [
    RadioButton,
    CreateEmployeeComponent,
    ListEmployeesComponent
  ],
  // If you want the components that belong to this module, available to
  // other modules, that import this module, then include all those
  // components in the exports array. Similarly you can also export the
  // imported Angular Modules
  // exports: [
  //   CreateEmployeeComponent,
  //   ReactiveFormsModule
  // ]
})
export class EmployeeModule { }