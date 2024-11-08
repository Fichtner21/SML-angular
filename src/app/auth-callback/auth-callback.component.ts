// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-auth-callback',
//   template: '<p>Logowanie...</p>',
// })
// export class AuthCallbackComponent implements OnInit {
//   constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private authService: AuthService) {}

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       const code = params['code']; // Extract the authorization code from query parameters
//       if (code) {
//         this.exchangeCodeForToken(code); // Call method to exchange code for token
//       } else {
//         console.warn('No authorization code found in URL');
//       }
//     });
//   }

//   exchangeCodeForToken(code: string): void {
//     this.http.post('http://localhost:5000/auth/discord/callback', { code }) // Send POST request with code
//       .subscribe(response => {
//         console.log('Token received:', response); // Handle successful response
//         this.router.navigate(['/update-elo']); // Navigate to update-elo component
//       }, error => {
//         console.error('Error exchanging code for token:', error);
//         alert('Failed to log in. Please try again.');
//       });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

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
    this.http.post('http://localhost:5000/auth/discord/callback', { code }) // Send POST request with code
      .subscribe(response => {
        console.log('Token received:', response); // Handle successful response
        
        // Save the token to local storage
        const discordToken = response['access_token']; // Adjust based on your backend response structure
        this.authService.saveToken(discordToken); // Save token using AuthService

        this.router.navigate(['/update-elo']); // Navigate to update-elo component
      }, error => {
        console.error('Error exchanging code for token:', error);
        alert('Failed to log in. Please try again.');
      });
  }
  // exchangeCodeForToken(code: string): void {
  //   this.http.post('http://localhost:5000/auth/discord/callback', { code })
  //     .subscribe((response: any) => {
  //       console.log('Token and user roles received:', response);
  
  //       // Sprawdź, czy odpowiedź zawiera informacje o statusie autoryzacji ról
  //       if (response.hasRequiredRole) {
  //         const discordToken = response.access_token; // Zaktualizuj zgodnie z odpowiedzią z backendu
  //         this.authService.saveToken(discordToken); // Zapisz token używając AuthService
  //         this.router.navigate(['/update-elo']);
  //       } else {
  //         alert('User does not have the required role.');
  //       }
  //     }, error => {
  //       console.error('Error exchanging code for token:', error);
  //       alert('Failed to log in. Please try again.');
  //     });
  // }
  
}