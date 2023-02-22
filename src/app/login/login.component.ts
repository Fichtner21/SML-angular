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
  allowedUsername = 'drBoB';
  allowedPassword = 'domeknarogu';
  constructor(private _auth: AuthService, private router: Router) {}
  ngOnInit() {}

  loginUser() {
    if (
      this.loginUserData.username == this.allowedUsername &&
      this.loginUserData.password == this.allowedPassword
    ) {
      // console.log('login success');
      localStorage.setItem('tokenLogin', 'secretToken');
      localStorage.setItem('is_admin', 'true');
      // this.router.navigate(['/about/secret']);
      this.router.navigate(['/dashboard']);
    } else {
      const btnCont = document.querySelector('.btn-cont');      
      if(!document.querySelector('.btn-cont .wrong')){
        const wrongInfo = document.createElement('div');
        wrongInfo.classList.add('wrong');
        wrongInfo.innerHTML = 'Invalid Nickname or Password';
        btnCont.appendChild(wrongInfo);
      }      
    }
  }

}

export interface User {
  username: string;
  password: string;
}
