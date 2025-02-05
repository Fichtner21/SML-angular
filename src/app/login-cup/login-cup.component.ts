import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-cup',
  templateUrl: './login-cup.component.html',
  styleUrls: ['./login-cup.component.scss']
})
export class LoginCupComponent {
  login2: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    this.http.post<{ access: number }>(`${environment.externalApiUrl}api/login-cup`, { login: this.login2, password: this.password })
      .subscribe(
        response => {
          localStorage.setItem('access', response.access.toString());
          this.message = "✅ Successfully logged in!";
          this.router.navigate(['/cup']); // 🔹 Przekierowanie do zakładki Cup
        },
        error => {
          this.message = "❌ Invalid login or password.";
        }
      );
  }
}
