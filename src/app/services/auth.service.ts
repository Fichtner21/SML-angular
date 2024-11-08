import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable } from 'rxjs';
import { authCodeFlowConfig } from '../dashboard/dashboard.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

interface DecodedToken {
  roles: string[];
  exp: number;
}

interface TokenResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private readonly tokenKey = 'discordToken';
  
  constructor(private oAuthService: OAuthService, private http: HttpClient, private router: Router) {
    oAuthService.configure(authCodeFlowConfig);

    this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
    });

    this.oAuthService.events.subscribe(() => {
      this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
    });
  } 

  login() {
    this.oAuthService.initLoginFlow();
  }

  logout() {
    this.oAuthService.logOut();
  }

  //  // Metoda do logowania przez Discord
  //  loginWithDiscord(code: string): Promise<void> {
  //   return this.http.post<{ token: string }>('http://localhost:5000/auth/discord', { code })
  //     .toPromise()
  //     .then(response => {
  //       localStorage.setItem(this.tokenKey, response.token);
  //     })
  //     .catch(error => {
  //       console.error('Błąd logowania:', error);
  //     });
  // }


  async fetchUserData(token: string): Promise<any> {
    try {
      const response = await this.http.get('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      }).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error; // Rethrow error for handling in component if needed
    }
  }

  

  logout2(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // Store token in local storage
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // Retrieve token from local storage
  }
  
  isLoggedIn(): boolean {
    return !!this.getToken(); // Check if token exists
  }

  // Method to initiate login with Discord
  loginWithDiscord(): void {
    const redirectUri = encodeURIComponent('http://localhost:5000/auth/discord/callback');
    const clientId = '1304093864877096970'; // Replace with your Discord client ID
    const scope = 'identify guilds';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('http://localhost:4500/discord-callback')}&response_type=code&scope=identify%20guilds`;
    
    window.location.href = discordAuthUrl; // Redirect to Discord's OAuth page
  }


 
 
}