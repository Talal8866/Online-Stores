import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {
  constructor(private http:HttpClient) { }

  getFeaturedProducts(){
    return this.http.get('http://localhost:3000/api/products/featured');
  }

  getFeaturedShops(){
    return this.http.get('http://localhost:3000/api/shops/featured');
  }
}
