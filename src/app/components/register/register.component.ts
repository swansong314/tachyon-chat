import { Component, OnInit } from '@angular/core';
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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  registerUser() {
    const newUser: UserType = {
      username: this.username,
      password: this.password,
    };

    this.auth.registerUser(newUser).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/login']);
      },
      (err) => console.log(err)
    );
  }
}
