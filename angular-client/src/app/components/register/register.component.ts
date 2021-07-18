import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fade, slide } from 'src/app/animations/animations';
import { AuthService } from 'src/app/services/auth.service';
import { UserType } from 'src/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fade, slide],
})
export class RegisterComponent implements OnInit {
  hide = true;
  username!: String;
  password!: String;
  userControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

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
      //LOG console.log(this.passwordControl);
      return 'A password must be entered.';
    }
    if (this.passwordControl.hasError('minlength')) {
      //LOG console.log(this.passwordControl);
      return 'The password should be atleast 8 characters long.';
    }
    return '';
  }

  registerUser() {
    const newUser: UserType = {
      username: this.username,
      password: this.password,
    };
    this.auth.registerUser(newUser).subscribe(
      (res) => {
        console.log(res);
        sessionStorage.setItem('token', res.token);
        this.router.navigate(['/login']);
      },
      (err) => {
        alert('User already exists. Please login.');
        console.log(err);
      }
    );
  }
}
