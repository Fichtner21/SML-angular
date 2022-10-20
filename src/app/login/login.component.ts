import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'
  ]
})
export class LoginComponent implements OnInit {

  loginUserData: User = { username: '', password: '' };
  allowedUsername = 'Mike';
  allowedPassword = '123';
  constructor(private _auth: AuthService, private router: Router) {}
  ngOnInit() {}

  loginUser() {
    if (
      this.loginUserData.username == this.allowedUsername &&
      this.loginUserData.password == this.allowedPassword
    ) {
      console.log('login success');
      localStorage.setItem('token', 'secretToken');
      localStorage.setItem('is_admin', 'true');
      this.router.navigate(['/about/secret']);
    }
  }

}

export interface User {
  username: string;
  password: string;
}
