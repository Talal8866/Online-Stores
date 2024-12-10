import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private http: HttpClient, private router: Router) { }

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private token: string = '';
  private currentUser: any = null;

  loginuser_service(model: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/users/login', model);
  }

  loginshop_service(model: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/shops/login', model);
  }

  createuser_service(model: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/users/register', model);
  }

  createshop_service(formData: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/shops/register', formData);
  }

  logoutuser_service(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.getToken()}` };
    return this.http.post('http://localhost:3000/api/users/logout', {}, { headers });
  }

  logoutshop_service(): Observable<any> {
    const headers = { 'Authorization': `Bearer ${this.getToken()}` };
    return this.http.post('http://localhost:3000/api/shops/logout', {}, { headers });
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    this.decodeToken(token);
  }

  getToken(): string {
    return this.token || localStorage.getItem('token') || '';
  }

  decodeToken(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        this.logout();
        this.router.navigate(['/login']);
      } else {
        this.setCurrentUser(decodedToken);
      }
    } catch (e) {
      console.error('Error decoding token:', e);
      this.logout();
    }
  }

  setCurrentUser(user: any) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): any {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      return null;
    }
    try {
      this.currentUser = JSON.parse(storedUser);
    } catch (e) {
      this.currentUser = null;
    }
    return this.currentUser;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
