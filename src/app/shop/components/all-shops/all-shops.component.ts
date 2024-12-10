import { Component } from '@angular/core';
import { ProductserviceService } from 'src/app/products/services/productservice.service';
import { ShopServiceService } from '../../services/shop-service.service';

@Component({
  selector: 'app-all-shops',
  templateUrl: './all-shops.component.html',
  styleUrls: ['./all-shops.component.css']
})
export class AllShopsComponent {
  constructor(private product_service: ProductserviceService, private shop_service: ShopServiceService) { }

  categories: any[] = [];
  shops: any[] = [];

  ngOnInit() {
    this.getShops_Here();
    this.getCategories_Here();
  }

  filtercategory(event: any) {
    let value = event.target.value;
    if (value === "all") {
      this.getShops_Here();
    } else {
      this.getShops_byCategories_Here(value);
    }
  }

  getShops_Here() {
    this.product_service.getShops().subscribe((res: any) => {
      this.shops = Array.isArray(res) ? res : [res];
    }, error => {
      alert("Couldn't get Shops");
    });
  }

  getCategories_Here() {
    this.product_service.getAllCategories().subscribe((res: any) => {
      this.categories = res.categories || res;
    }, error => {
      alert("Couldn't get Categories");
    });
  }

  getShops_byCategories_Here(keyWord: string) {
    this.product_service.getShops_byCategories(keyWord).subscribe((res: any) => {
      this.shops = res.shops || res; 
    });
  }
}
