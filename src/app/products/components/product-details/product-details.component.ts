import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductserviceService } from '../../services/productservice.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  constructor(
  private route: ActivatedRoute,
  private service: ProductserviceService) {}

  @Output() item = new EventEmitter();
  @Output() wish_item = new EventEmitter();
  @Input() products: any = {};

  _id: string | null = '';
  amount: number = 0;
  data: any = {};

  ngOnInit(): void {
    this._id = this.route.snapshot.paramMap.get('productId');
    console.log('Captured ID:', this._id); 
    if (this._id) {
      this.getProductByID_Here(this._id);
    } else {
      console.error('Product ID is undefined');
    }
  }

  getProductByID_Here(id: string) {
    this.service.getProductByID(id).subscribe(res => {
      this.data = res;
    }, error => {
      console.error('Error fetching product details:', error);
    });
  }

  addto_Cart() {
    this.item.emit({ item: this.data, quantity: this.amount });
  }

  addto_wishlist() {
    this.wish_item.emit({ wish_item: this.data });
  }
}
