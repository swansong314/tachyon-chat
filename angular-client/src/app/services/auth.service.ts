import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserType } from 'src/User';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private registerUrl = `${baseUrl}api/register`;
  private loginUrl = `${baseUrl}api/login`;
  // private registerUrl = 'http://localhost:8080/api/register';
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
