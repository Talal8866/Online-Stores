import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {
  constructor(private http: HttpClient) { }

  changeUserData(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.patch('http://localhost:3000/api/users/profile/update', model, { headers });
  }

  changeUserpassword(model: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.post('http://localhost:3000/api/users/profile/change-password', model, { headers });
  }

  getUserbyID() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    return this.http.get('http://localhost:3000/api/users/profile', { headers });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
