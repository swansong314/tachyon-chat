import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { exit, fade, slide } from 'src/app/animations/animations';
import { AuthService } from 'src/app/services/auth.service';
import { UserType } from 'src/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fade, slide, exit],
})
export class LoginComponent implements OnInit {
  hide = true;
  username!: String;
  password!: String;
  isInFrame: boolean = true;
  userControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required]);

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  getUsernameError() {
    if (this.userControl.hasError('required')) {
      return 'A username must be entered.';
    }
    return '';
  }


  getPasswordError() {
    if (this.passwordControl.hasError('required')) {
      return 'A password must be entered.';
    }
    return '';
  }

  loginUser() {
    this.isInFrame = false;
    const user: UserType = {
      username: this.username,
      password: this.password,
    };
    this.auth.loginUser(user).subscribe(
      (res) => {
        sessionStorage.setItem('token', res.token);
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 300);
      },
      (err) => {
        alert('Invalid username or password.');
        console.log(err);
      }
    );
  }
}
