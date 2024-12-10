import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthServiceService } from 'src/app/auth/services/auth.service.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  constructor(private service_auth: AuthServiceService) { }

  @Output() item = new EventEmitter();
  @Input() type: string = "user"
  wishlist_products: any[] = [];

  ngOnInit(): void {
    this.getwishlistproduct()
  }

  logout() {
    if (this.type === 'user') {
      this.service_auth.logoutuser_service().subscribe(
        (res: any) => {
          alert("You have logged out");
          this.service_auth.setCurrentUser(null); // Clear current user
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
          this.service_auth.setCurrentUser(null); // Clear current user
          console.log(res);
        },
        (error: any) => {
          console.error('Error during shop logout:', error);
        }
      );
    }
  }

  getwishlistproduct() {
    if ("wishlist" in localStorage) {
      this.wishlist_products = JSON.parse(localStorage.getItem("wishlist")!)
    }
  }

  deleteProduct(index: number) {
    this.wishlist_products.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(this.wishlist_products));
  }

  add_toCart(index: number){
    this.item.emit({ item: this.wishlist_products[index]}) 
  }
}
