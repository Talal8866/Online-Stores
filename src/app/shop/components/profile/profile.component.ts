import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductserviceService } from 'src/app/products/services/productservice.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private productsService: ProductserviceService,) { }

  shopProducts: any[] = [];
  name: any = {};
  selectedShopId: string = '';
  shopName: string = '';

  ngOnInit(): void {
    this.selectedShopId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Captured Shop ID:', this.selectedShopId); // Log to verify captured shop ID
    if (this.selectedShopId) {
      this.getPublicShop_Here(this.selectedShopId);
    }
  }

  getPublicShop_Here(shopId: string) {
    console.log('Fetching shop profile for ID:', shopId); // Log to verify the shopId before making the API call
    this.productsService.getPublicShopProfile(shopId).subscribe((res: any) => {
      this.name = res;
      this.shopName = res.name;
      this.shopProducts = res.products;
    }, error => {
      console.error('Error fetching shop profile:', error);
    });
  }
}
