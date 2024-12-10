import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private routes: Router, private service: AuthServiceService) { }
  signupForm!: FormGroup;
  showPassword = false;

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      fullname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      address: new FormControl(null, [Validators.required]),
      number: new FormControl(null, [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]),
      pass: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmpass: new FormControl(null, [Validators.required]),
    }, { validators: this.passwordMatchValidator })
  }

  Submit1() {
    if (this.signupForm.valid && this.signupForm.errors === null) {
      const model = {
        name: this.signupForm.value.fullname,
        email: this.signupForm.value.email,
        password: this.signupForm.value.pass,
        address: this.signupForm.value.address,
        phoneNumber: this.signupForm.value.number,
        confirmPassword: this.signupForm.value.confirmpass,
      };
      if (model.password === this.signupForm.value.confirmpass) {
        this.service.createuser_service(model).subscribe(
          res => {
            alert("success");
            console.log(res);
          },
        );
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Form is invalid!");
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('pass');
    const confirmPassword = control.get('confirmpass');
    if (password?.value !== confirmPassword?.value) {
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  getButtonStyles() {
    return this.signupForm.invalid || (this.signupForm.value.pass !== this.signupForm.value.confirmpass)
      ? { 'background-color': 'var(--mid-gray)', 'cursor': 'not-allowed', 'color': 'var(--custom-white)' }
      : { 'background-color': 'var(--dark-maincolor)', 'cursor': 'pointer', 'color': 'var(--custom-white)' };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
