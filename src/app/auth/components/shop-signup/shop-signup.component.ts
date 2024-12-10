import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth.service.service';

@Component({
  selector: 'app-shop-signup',
  templateUrl: './shop-signup.component.html',
  styleUrls: ['./shop-signup.component.css']
})
export class ShopSignupComponent {
  constructor(private service: AuthServiceService) { }

  shopForm!: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  showPassword = false;

  ngOnInit(): void {
    this.shopForm = new FormGroup({
      shopname: new FormControl(null, [Validators.required]),
      shopcategory: new FormControl(null, [Validators.required]),
      shopemail: new FormControl(null, [Validators.required, Validators.email]),
      shopaddress: new FormControl(null, [Validators.required]),
      shopnumber: new FormControl(null, [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]),
      pass: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      confirmpass: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
    }, { validators: this.passwordMatchValidator });
  }

  Submit2() {
    if (this.shopForm.valid && this.shopForm.errors == null) {
      const model = {
        name: this.shopForm.value.shopname,
        email: this.shopForm.value.shopemail,
        password: this.shopForm.value.pass,
        address: this.shopForm.value.shopaddress,
        phoneNumber: this.shopForm.value.shopnumber,
        shopCategory: this.shopForm.value.shopcategory,
        logo: this.shopForm.value.image,  // رفع مسار الصورة فقط
        confirmPassword: this.shopForm.value.confirmpass,
      };

      if (model.password === this.shopForm.value.confirmpass) {
        this.service.createshop_service(model).subscribe(
          res => {
            alert("Success");
            console.log(res);
          },
          err => {
            console.error('Error creating shop account:', err);
          }
        );
      } else {
        alert("Passwords do not match!");
      }
    } else {
      alert("Form is invalid!");
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result;
          // تخزين مسار الصورة بدلاً من تحميل الصورة نفسها
          this.shopForm.patchValue({ image: `Online Stores/uploads/${file.name}` });
        }
      };
      reader.readAsDataURL(file);
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
    return this.shopForm.invalid || (this.shopForm.value.pass !== this.shopForm.value.confirmpass)
      ? { 'background-color': 'var(--mid-gray)', 'cursor': 'not-allowed', 'color': 'var(--custom-white)' }
      : { 'background-color': 'var(--dark-maincolor)', 'cursor': 'pointer', 'color': 'var(--custom-white)' };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
