import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductserviceService {
  constructor(private http: HttpClient) { }

  getAllCategories() {
    return this.http.get('http://localhost:3000/api/categories');
  }

  getProducts() {
    return this.http.get('http://localhost:3000/api/products/all');
  }

  getProducts_byCategories(keyWord: string) {
    return this.http.get(`http://localhost:3000/api/products/list/${keyWord}`);
  }

  getProductByID(id: string) {
    return this.http.get(`http://localhost:3000/api/products/get/${id}`);
  }

  getShops() {
    return this.http.get('http://localhost:3000/api/shops');
  }

  getShops_byCategories(keyWord: string) {
    return this.http.get(`http://localhost:3000/api/shops/categories/${keyWord}`);
  }

  getPublicShopProfile(shopId: string) {
    return this.http.get(`http://localhost:3000/api/shops/${shopId}`);
  }

  getShopByID() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get(`http://localhost:3000/api/shops/profile`, { headers });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
