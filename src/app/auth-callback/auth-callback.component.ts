import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth-callback',
  template: '<p>Logowanie...</p>',
})
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code']; // Extract the authorization code from query parameters
      if (code) {
        this.exchangeCodeForToken(code); // Call method to exchange code for token
      } else {
        console.warn('No authorization code found in URL');
      }
    });  
  }
  
  exchangeCodeForToken(code: string): void {
    this.http.post(`${environment.externalApiUrl}auth/discord/callback`, { code }) // Send POST request with code
      .subscribe(response => {
        console.log('Token received:', response); // Handle successful response
        this.authService.setUserData(response);
        const userData = {
          id: response['id'],
          username: response['username'],
          avatar: response['avatar'],
          discriminator: response['discriminator'],
          public_flags: response['public_flags'],
          flags: response['flags'],
          banner: response['banner'],
          accent_color: response['accent_color'],
          global_name: response['global_name'],
          avatar_decoration_data: response['avatar_decoration_data'],
          banner_color: response['banner_color'],
          clan: response['clan'],
          mfa_enabled: response['mfa_enabled'],
          locale: response['locale'],
          premium_type: response['premium_type']
        };
  
        // Zapisz obiekt userData jako string w local storage
        localStorage.setItem('userData', JSON.stringify(userData));
        // Save the token to local storage
        const discordToken = response['access_token']; // Adjust based on your backend response structure
        console.log('TOKEN', discordToken)
        this.authService.saveToken(discordToken); // Save token using AuthService

        this.router.navigate(['/']); // Navigate to main component
      }, error => {
        console.error('Error exchanging code for token:', error);
        alert('Failed to log in. Please try again.');
      });
  }  
}