import { Component, Input } from '@angular/core';
import { ProductserviceService } from 'src/app/products/services/productservice.service';

@Component({
  selector: 'app-shop-card',
  templateUrl: './shop-card.component.html',
  styleUrls: ['./shop-card.component.css']
})
export class ShopCardComponent {
  constructor(private service: ProductserviceService) { }

  @Input() shop: any; 
  @Input() categories: any[] = [];

  getImagePath(relativePath: string): string {
    if (!relativePath) {
      return ''; // أو يمكنك إعادة مسار صورة افتراضي
    }
    return `http://localhost:3000/uploads/${relativePath.split('/').pop()}`; // تكوين URL للصور
  }

  get_PublicShopHere(){
    // this.service.getPublicShopProfile().subscribe
  }
}
