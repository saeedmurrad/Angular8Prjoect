import { Component, OnInit } from '@angular/core';
// Import FormGroup and FormControl classes
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidators } from '../shared/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {

  // Group properties on the formErrors object. The UI will bind to these properties
  // to display the respective validation messages
  formErrors = {
    // 'fullName': '',
    // 'email': '',
    // 'confirmEmail': '',
    // 'emailGroup': '',
    // 'phone': '',
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  };

  // This structure stoes all the validation messages for the form Include validation
  // messages for confirmEmail and emailGroup properties. Notice to store the
  // validation message for the emailGroup we are using emailGroup key. This is the
  // same key that the matchEmails() validation function below returns, if the email
  // and confirm email do not match.
  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 10 characters.',
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Email domian should be dell.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match.'
    },
    'phone': {
      'required': 'Phone is required.'
    },
    // 'skillName': {
    //   'required': 'Skill Name is required.',
    // },
    // 'experienceInYears': {
    //   'required': 'Experience is required.',
    // },
    // 'proficiency': {
    //   'required': 'Proficiency is required.',
    // },
  };

  // This FormGroup contains fullName and Email form controls
  employeeForm: FormGroup;
  employee: IEmployee;
  pageTitle: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private employeeService: EmployeeService, private router: Router) { }

  // Initialise the FormGroup with the 2 FormControls we need.
  // ngOnInit ensures the FormGroup and it's form controls are
  // created when the component is initialised
  ngOnInit() {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidators.emailDomain('dell.com')]],
        confirmEmail: ['', [Validators.required]],
      }, { validator: matchEmail }),
      phone: [''],
      // Other Form Controls..
      // Create skills FormArray using the injected FormBuilder
      // class array() method. At the moment, in the created
      // FormArray we only have one FormGroup instance that is
      // returned by addSkillFormGroup() method
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    });

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPrefernceChange(data);
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.getEmployee(empId);
        this.pageTitle = 'Edit Employee';
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });
  }
  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          // Store the employee object returned by the
          // REST API in the employee property
          this.employee = employee;
          this.editEmployee(employee);
        },
        (err: any) => console.log(err)
      );
  }
  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }
  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }
  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }
  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }
  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();

    if (this.employee.id) {
      this.employeeService.updateEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    } else {
      this.employeeService.addEmployee(this.employee).subscribe(
        () => this.router.navigate(['list']),
        (err: any) => console.log(err)
      );
    }
  }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }
  // If the Selected Radio Button value is "phone", then add the
  // required validator function otherwise remove it
  onContactPrefernceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      // abstractControl.value !== '' (This condition ensures if there is a value in the
      // form control and it is not valid, then display the validation error)
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }
  onLoadDataClick(): void {
    console.log(this.formErrors);
  }

}
// Nested form group (emailGroup) is passed as a parameter. Retrieve email and
// confirmEmail form controls. If the values are equal return null to indicate
// validation passed otherwise an object with emailMismatch key. Please note we
// used this same key in the validationMessages object against emailGroup
// property to store the corresponding validation error message
function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  // If confirm email control value is not an empty string, and if the value
  // does not match with email control value, then the validation fails
  if (emailControl.value === confirmEmailControl.value
    || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
