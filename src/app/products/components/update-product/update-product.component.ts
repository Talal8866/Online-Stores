import { Component, Input, OnInit } from '@angular/core';
import { ShopServiceService } from 'src/app/shop/services/shop-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductserviceService } from '../../services/productservice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  constructor(
    private shop_service: ShopServiceService,
    private product_service: ProductserviceService,
    private route: ActivatedRoute) { }

  updateProductForm!: FormGroup;
  @Input() products: any = {};

  imageUrl: string | ArrayBuffer | null = null;
  fileToUpload: File | null = null;
  _id: string | null = '';
  data: any = {};

  ngOnInit(): void {
    this.updateProductForm = new FormGroup({
      productname: new FormControl(null, Validators.required),
      price: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      availability: new FormControl(null, Validators.required),
      // quantity: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this._id = this.route.snapshot.paramMap.get('productId');
    console.log('Captured ID:', this._id); 
    if (this._id) {
      this.getProductByID_Here(this._id);
    } else {
      console.error('Product ID is undefined');
    }
  }

  getProductByID_Here(id: string) {
    this.product_service.getProductByID(id).subscribe(res => {
      this.data = res;

      this.updateProductForm.patchValue({
        productname: this.data.name,
        price: this.data.price,
        description: this.data.description,
        category: this.data.category,
        availability: this.data.availability,
        // quantity: this.data.quantity
      });

      if (this.data.picture) {
        this.imageUrl = `http://localhost:3000/uploads/${this.data.picture}`;
      }
    }, error => {
      console.error('Error fetching product details:', error);
    });
  }

  submitUpdate() {
    const model = {
      name: this.updateProductForm.value.productname,
      price: this.updateProductForm.value.price,
      description: this.updateProductForm.value.description,
      category: this.updateProductForm.value.category,
      availability: this.updateProductForm.value.availability,
      // quantity: this.updateProductForm.value.quantity
    };

    const formData: FormData = new FormData();
    formData.append('productData', JSON.stringify(model));
    if (this.fileToUpload) {
      formData.append('picture', this.fileToUpload, this.fileToUpload.name);
    }

    this.shop_service.updateProduct(formData).subscribe(
      (res: any) => {
        alert("Your product updated successfully");
      },
      (error: any) => {
        console.error('Error updating product:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.fileToUpload = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
