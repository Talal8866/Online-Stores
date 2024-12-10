import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { ShopServiceService } from '../../services/shop-service.service';
import { AuthServiceService } from 'src/app/auth/services/auth.service.service';
import { AuthStatusService } from 'src/app/shared/services/auth-status.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductserviceService } from 'src/app/products/services/productservice.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  constructor(
    private Products_service: ProductserviceService,
    private authStatusService: AuthStatusService,
    private service_auth: AuthServiceService,
    private shop_service: ShopServiceService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  editprofileForm!: FormGroup;
  changepassForm!: FormGroup;
  changelogoForm!: FormGroup;
  changedescForm!: FormGroup;

  @Input() isShopOwner: boolean = false;
  @Input() isClient: boolean = false;
  @Input() type: string = "User";
 
  imageUrl: string | ArrayBuffer | null = null;
  selectedShopId: string = '';
  shopProducts: any[] = [];
  shopName: string = '';
  showPassword = false;
  name: any = {};

  ngOnInit(): void {
    this.changelogoForm = new FormGroup({
      newlogo: new FormControl(null, [Validators.required]),
    });

    this.changedescForm = new FormGroup({
      newdesc: new FormControl(null, [Validators.required]),
    });

    this.changepassForm = this.fb.group({
      currentPassword: [null, Validators.required],
      newpass: [null, [Validators.required, Validators.minLength(8)]],
      confirmpass: [null, Validators.required]
    });

    this.editprofileForm = this.fb.group({
      shopname: [null, Validators.required],
      shopcategory: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      address: [null, Validators.required],
      number: [null, [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]]
    });

    this.getShopByID_Here();
    this.getShopProducts_Here();
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
      name: this.editprofileForm.value.shopname,
      email: this.editprofileForm.value.email,
      address: this.editprofileForm.value.address,
      phoneNumber: this.editprofileForm.value.number,
      shopCategory: this.editprofileForm.value.shopcategory
    };
    this.shop_service.changeShopData(model).subscribe(
      res => {
        alert("Profile updated successfully");
      },
      error => {
        alert("Couldn't change shop information");
      }
    );
  }

  Submit_pass() {
    const model = {
      currentPassword: this.changepassForm.value.currentPassword,
      newPassword: this.changepassForm.value.newpass,
      confirmPassword: this.changepassForm.value.confirmpass
    };
    this.shop_service.changeShoppassword(model).subscribe(
      res => {
        alert("Password changed successfully");
      },
      error => {
        alert("Couldn't change shop password");
      }
    );
  }

  Submit_Logo() {
    const formData = new FormData();
    formData.append('logo', this.changelogoForm.get('newlogo')?.value);
    this.shop_service.changeShopLogo(formData).subscribe(
      res => {
        alert("Logo updated successfully");
      },
      error => {
        alert("Couldn't change shop logo");
      }
    );
  }

  Submit_Desc() {
    const model = {
      description: this.changedescForm.value.newdesc
    };
    this.shop_service.changeShopDescription(model).subscribe(
      res => {
        alert("Description updated successfully");
      },
      error => {
        alert("Couldn't change shop description");
      }
    );
  }

  getShopByID_Here() {
    this.Products_service.getShopByID().subscribe(
      (res: any) => {
        this.service_auth.setCurrentUser(res);
        this.name = res;
        this.editprofileForm.patchValue({
          shopname: res.name,
          shopcategory: res.shopCategory,
          email: res.email,
          address: res.address,
          number: res.phoneNumber
        });
      },
      error => {
        alert("Couldn't get Shop profile");
        console.error('Error:', error);
      }
    );
  }

  getShopProducts_Here() {
    this.Products_service.getShopByID().subscribe(
      (res: any) => {
        if (Array.isArray(res.products)) {
          this.shopProducts = res.products; 
        } else {
          console.error('Expected products to be an array');
          this.shopProducts = [];
        }
      },
      error => {
        alert("Couldn't get Shop products");
        console.error('Error:', error);
        this.shopProducts = [];
      }
    );
  }

  delete_Product(item: any) {
    const productId = item._id || item.id; 
    if (productId) {
      this.shop_service.deleteProduct(productId).subscribe(
        (res: any) => {
          alert("Product deleted successfully");
          this.getShopProducts_Here();
        },
        (error: any) => {
          alert("Couldn't delete product");
          console.error('Error:', error);
        }
      );
    } else {
      console.error("Product ID is undefined or invalid");
      alert("Error: Product ID is undefined or invalid");
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
          this.editprofileForm.patchValue({ image: e.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  }
}

