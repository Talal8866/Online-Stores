import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service.service';
import { AuthStatusService } from '../../../shared/services/auth-status.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private routes: Router,
    private service: AuthServiceService,
    private authStateService: AuthStatusService
  ) { }

  loginForm!: FormGroup;
  users: any[] = [];
  type: string = 'user';
  showPassword = false;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      pass: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      type: new FormControl(this.type)
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  Submit() {
    const model = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.pass,
    };
    const loginService = this.loginForm.value.type === 'user'
      ? this.service.loginuser_service(model)
      : this.service.loginshop_service(model);
    loginService.subscribe(
      (res: any) => {
        console.log('Login response:', res);
        this.service.setToken(res.token);
        this.service.setCurrentUser(res.user);
        this.authStateService.setCurrentUser(res.user);
        alert('Success');
        const navigateTo = this.loginForm.value.type === 'user' ? '/client-details' : '/edit-profile';
        this.routes.navigate([navigateTo]);
      },
      err => {
        console.error(err);
      }
    );
  }

  getButtonStyles() {
    return this.loginForm.invalid
      ? { 'background-color': 'var(--mid-gray)', 'cursor': 'not-allowed', 'color': 'var(--custom-white)' }
      : { 'background-color': 'var(--dark-maincolor)', 'cursor': 'pointer', 'color': 'var(--custom-white)' };
  }
}
