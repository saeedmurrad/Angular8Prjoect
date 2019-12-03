import { Component, OnInit } from '@angular/core';
// Import FormGroup and FormControl classes
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

   // This FormGroup contains fullName and Email form controls
   employeeForm: FormGroup;

   constructor(private fb: FormBuilder) { }
 
   // Initialise the FormGroup with the 2 FormControls we need.
   // ngOnInit ensures the FormGroup and it's form controls are
   // created when the component is initialised
   ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]] ,
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['beginner']
      }),
    });
   }
   onSubmit(): void {
    console.log(this.employeeForm.value);
  }

  onLoadDataClick(): void {
    //.patchValue() can be used for updating partial controls
    this.employeeForm.setValue({
      fullName: 'Saeed Murrad',
      email: 'saeedmurrad@gmail.com',
      skills: {
        skillName: 'Java',
        experienceInYears: 3,
        proficiency: 'intermediate'
      }
    });
  }

}
