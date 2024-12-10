import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductserviceService } from 'src/app/products/services/productservice.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
  constructor(private product_service: ProductserviceService, private route: ActivatedRoute,) {}

  @Input() product: any;
  @Output() item = new EventEmitter();
  shopName: string = '';
  addbutton: boolean = false;
  amount: number = 0;
  imgpath: string = '';

  ngOnInit(): void {
    this.getShopName();
    this.setImagePath();
  }

  getShopName() {
    if (this.product && this.product.linkedShop) {
      this.product_service.getPublicShopProfile(this.product.linkedShop).subscribe((res: any) => {
        this.shopName = res.name;
        console.log(res);
      }, error => {
        console.error('Error fetching shop name:', error);
      });
    }
  }

  setImagePath() {
    this.imgpath = this.product?.picture ? `http://localhost:3000/uploads/${this.product.picture.split('/').pop()}` : ''; // تكوين URL للصور
  }

  add() {
    this.item.emit({ item: this.product, quantity: this.amount });
  }
}
