import { Component } from '@angular/core';
import { ProductserviceService } from '../../services/productservice.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent {
  constructor(private Products_service: ProductserviceService) {}

  name: string | null = '';
  products: any[] = [];
  categories: any[] = [];
  cart_products: any[] = [];
  shopProducts: any[] = [];

  ngOnInit() {
    this.getProducts_Here();
    this.getCategories_Here();
    if (this.name) { 
      this.getShopProducts_Here();
    }
  }

  filtercategory(event: any) {
    let value = event.target.value;
    if (value == "all") {
      this.getProducts_Here();
    }
    else {
      this.getProducts_byCategories_Here(value);
    }
  }

  getProducts_Here() {
    this.Products_service.getProducts().subscribe((res: any) => {
      console.log(res);
      this.products = res.products || res; 
    }, error => {
      alert("couldn't get all products");
    });
  }

  getShopProducts_Here() {
    this.Products_service.getPublicShopProfile(this.name!).subscribe((res: any) => {
      console.log(res);
      this.shopProducts = res.products || res; 
    }, error => {
      alert("couldn't get shops products");
    });
  }

  getCategories_Here() {
    this.Products_service.getAllCategories().subscribe((res: any) => {
      console.log(res);
      this.categories = res.categories || res; 
    }, error => {
      alert("couldn't get categories");
    });
  }

  getProducts_byCategories_Here(keyWord: string) {
    this.Products_service.getProducts_byCategories(keyWord).subscribe((res: any) => {
      this.products = res.products || res
    });
  }

  addtocart(event: any) {
    if ("cart" in localStorage) {
      this.cart_products = JSON.parse(localStorage.getItem("cart")!);
      let exist = this.cart_products.find(item => item.item.id == event.item.id);
      if (exist) {
        alert("The Product is Already in your Cart");
      }
      else {
        this.cart_products.push(event);
        localStorage.setItem("cart", JSON.stringify(this.cart_products));
      }
    }
    else {
      localStorage.setItem("cart", JSON.stringify(this.cart_products));
    }
  }
}
