import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from '../../auth/services/auth.service.service'; 

@Injectable({
  providedIn: 'root'
})
export class ShopServiceService {
  constructor(private http: HttpClient, private authService: AuthServiceService) { }

  changeShopData(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.patch('http://localhost:3000/api/shops/profile/update', model, { headers });
  }

  changeShoppassword(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post('http://localhost:3000/api/shops/profile/change-password', model, { headers });
  }

  changeShopLogo(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post('http://localhost:3000/api/shops/profile/logo', model, { headers });
  }

  changeShopDescription(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.patch('http://localhost:3000/api/shops/profile/description', model, { headers });
  }

  deleteProduct(productId: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.delete(`http://localhost:3000/api/products/delete/${productId}`, { headers });
  }

  updateProduct(model: FormData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post('http://localhost:3000/api/products/update', model, { headers });
  }

  addProduct(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post('http://localhost:3000/api/products', model, { headers });
  }

  getShopProductsByName(shopName: string) {
    return this.http.get(`http://localhost:3000/api/products/shop/${shopName}`);
  }
}
