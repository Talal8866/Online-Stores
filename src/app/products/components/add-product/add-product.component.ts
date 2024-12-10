import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShopServiceService } from 'src/app/shop/services/shop-service.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  constructor(private shop_service: ShopServiceService) { }

  addProductForm!: FormGroup;
  @Input() name: any;

  imageUrl: string | ArrayBuffer | null = null;
  fileToUpload: File | null = null;

  ngOnInit(): void {
    this.addProductForm = new FormGroup({
      productname: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required]),
      availability: new FormControl(null, Validators.required),
      // quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
    })
  }

  submitAdd() {
    const model = {
      name: this.addProductForm.value.productname,
      price: this.addProductForm.value.price,
      description: this.addProductForm.value.description,
      category: this.addProductForm.value.category,
      picture: this.addProductForm.value.image,
      availability: this.addProductForm.value.availability,
      // quantity: this.addProductForm.value.quantity
    }
    this.shop_service.addProduct(model).subscribe((res: any) => {
      res = alert("The Product Added Successfully")
    })
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
