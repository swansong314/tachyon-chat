import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserType } from 'src/User';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = '/api/register';
  // private registerUrl = 'http://localhost:8080/api/register';
  private loginUrl = '/api/login';
  // private loginUrl = 'http://localhost:8080/api/login';
  username!: String;
  constructor(private http: HttpClient) {}

  registerUser(user: UserType) {
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user: UserType) {
    this.username = user.username;
    return this.http.post<any>(this.loginUrl, user);
  }

  loggedIn() {
    return !!sessionStorage.getItem('token');
  }

  getToken() {
    return sessionStorage.getItem('token');
  }
}