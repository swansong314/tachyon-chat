import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fade, slide } from 'src/app/animations/animations';
import { AuthService } from 'src/app/services/auth.service';
import { UserType } from 'src/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [fade, slide],
})
export class LoginComponent implements OnInit {
  hide = true;
  username!: String;
  password!: String;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  loginUser() {
    const user: UserType = {
      username: this.username,
      password: this.password,
    };
    this.auth.loginUser(user).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/chat']);
      },
      (err) => console.log(err)
    );
  }
}
