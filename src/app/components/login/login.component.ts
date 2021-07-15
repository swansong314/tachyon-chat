import { Component, OnInit } from '@angular/core';
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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  loginUser() {
    this.isInFrame = false;
    const user: UserType = {
      username: this.username,
      password: this.password,
    };
    this.auth.loginUser(user).subscribe(
      (res) => {
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 300);
      },
      (err) => console.log(err)
    );
  }
}
