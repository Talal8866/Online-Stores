import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/auth/services/auth.service.service';
import { ClientServiceService } from '../../services/client-service.service';
import { AuthStatusService } from 'src/app/shared/services/auth-status.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent {
  constructor(
    private fb: FormBuilder,
    private service_auth: AuthServiceService,
    private authStatusService: AuthStatusService,
    private service: ClientServiceService,
    private router: Router
  ) { }

  editprofileForm!: FormGroup;
  changepassForm!: FormGroup;

  @Input() isShopOwner: boolean = false;
  @Input() isClient: boolean = false;
  @Input() type: string = "User"
  
  showPassword = false;
  name: any = {}

  ngOnInit(): void {
    this.changepassForm = this.fb.group({
      currentPassword: [null, Validators.required],
      newpass: [null, [Validators.required, Validators.minLength(8)]],
      confirmpass: [null, Validators.required]
    });

    this.editprofileForm = this.fb.group({
      fullname: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      address: [null, Validators.required],
      number: [null, [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });
    this.getUserbyID_Here();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  logout() {
    if (this.type === 'user') {
      this.service_auth.logoutuser_service().subscribe(
        (res: any) => {
          alert("You have logged out");
          this.authStatusService.clearCurrentUser();
          this.router.navigate(['/login']);
          this.isClient = false;
          console.log(res);
        },
        (error: any) => {
          console.error('Error during user logout:', error);
        }
      );
    } else {
      this.service_auth.logoutshop_service().subscribe(
        (res: any) => {
          alert("You have logged out");
          this.authStatusService.clearCurrentUser();
          this.router.navigate(['/login']);
          this.isShopOwner = false;
          console.log(res);
        },
        (error: any) => {
          console.error('Error during shop logout:', error);
        }
      );
    }
  }

  Submit_Changes() {
    const model = {
      name: this.editprofileForm.value.fullname,
      email: this.editprofileForm.value.email,
      address: this.editprofileForm.value.address,
      phoneNumber: this.editprofileForm.value.number
    };
    this.service.changeUserData(model).subscribe(
      (res: any) => {
        alert("Profile updated successfully");
      },
      error => {
        alert("Couldn't change user information");
      }
    );
  }

  Submit_pass() {
    const model = {
      currentPassword: this.changepassForm.value.currentPassword,
      newPassword: this.changepassForm.value.newpass,
      confirmPassword: this.changepassForm.value.confirmpass
    };
    this.service.changeUserpassword(model).subscribe(
      (res: any) => {
        alert("Password changed successfully");
      },
      error => {
        alert("Couldn't change user password");
      }
    );
  }

  getUserbyID_Here() {
    this.service.getUserbyID().subscribe(
      (res: any) => {
        this.service_auth.setCurrentUser(res);
        this.name = res;
      },
      error => {
        alert("Couldn't get User profile");
      }
    );
  }
}
