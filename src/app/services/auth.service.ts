import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { authCodeFlowConfig } from '../dashboard/dashboard.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  private apiUrl = 'http://localhost:5000';
  private userRoles: string[] = [];
  private userData: any = null; // Przechowuj dane użytkownika
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatus$ = this.loginStatus.asObservable();
  private userRolesSubject = new BehaviorSubject<string[] | null>(null);
  userRoles$ = this.userRolesSubject.asObservable();
  private guildId = '716723661909786690';

  // Login by google (MUST!!)
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedInGoogle());
  

  
  constructor(private oAuthService: OAuthService, private http: HttpClient, private router: Router) {
    oAuthService.configure(authCodeFlowConfig);

    // this.oAuthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    //   this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
    // });

    // this.oAuthService.events.subscribe(() => {
    //   this.isAuthenticatedSubject.next(this.oAuthService.hasValidAccessToken());
    // });
    this.oAuthService.events.subscribe(event => {
      if (event.type === 'token_received') {
        this.accessTokenSubject.next(this.oAuthService.getAccessToken());
        this.loggedInSubject.next(true);  // Ustawienie statusu logowania na true
      }
    });
    
  } 

  // Uruchomienie logowania po kliknięciu w przycisk
   // Logowanie użytkownika
  login() {
    this.oAuthService.initCodeFlow();
    this.oAuthService.events.subscribe((event) => {
      if (event.type === 'token_received') {
        this.loggedInSubject.next(true);
        this.getUserDataGoogle();  // Zaktualizowanie statusu logowania
      }
    });
  }

  loggedIn$ = this.loggedInSubject.asObservable();

  logout() {
    this.oAuthService.logOut();
    this.accessTokenSubject.next(null);
    this.loggedInSubject.next(false);
  }

   // Zaktualizowanie statusu logowania, np. po zalogowaniu
   setLoggedIn(value: boolean) {
    this.loggedInSubject.next(value);
  }

  getUserDataGoogle() {
    // Pobiera dane z tokenu ID
    const user = this.oAuthService.getIdentityClaims();
    console.log('User Data:', user);
    return user || null;
  }

  async fetchUserProfile() {
    // Opcjonalne: Pobieranie pełnych danych użytkownika
    const profile = await this.oAuthService.loadUserProfile();
    console.log('User Profile:', profile);
    return profile;
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  isLoggedInGoogle(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  loggedIn(){
    let hasToken = false;
    if (localStorage.getItem('tokenLogin') == 'secretToken'){
      hasToken = true;
    }
    return hasToken;
  }

  // getToken(){
  //   return localStorage.getItem('tokenLogin');
  // }
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

  getUserRoles(userId: string, guildId: string): Observable<any> {
    return this.http.get<any>(`${environment.externalApiUrl}discord/user-roles`, {
      params: { userId, guildId }
    });
  } 

  private getUserIdFromLocalStorage(): string | null {
    const userDataString = localStorage.getItem('userData');
    const userDataDiscord = userDataString ? JSON.parse(userDataString) : null;
    return userDataDiscord?.id || null;
  }

  getUserRoles3(): Observable<{ roles: string[] }> {
    const userId = this.getUserIdFromLocalStorage();
  
    if (!userId) {
      console.error('Brak userId. Użytkownik może nie być zalogowany.');
      return of({ roles: [] }); // Zwróć pusty obiekt z pustą tablicą ról
    }
  
    if (this.userRolesSubject.getValue()) {
      return of({ roles: this.userRolesSubject.getValue() });
    }
  
    return this.http.get<{ roles: string[] }>(`${environment.externalApiUrl}discord/user-roles`, {
      params: { userId, guildId: this.guildId }
    }).pipe(
      tap(response => {
        this.userRolesSubject.next(response.roles); // Zapisz role w BehaviorSubject
      }),
      catchError(error => {
        console.error('Błąd podczas pobierania ról użytkownika:', error);
        return of({ roles: [] }); // Zwróć pusty obiekt w razie błędu
      })
    );
  }
  

  clearRoles(): void {
    this.userRolesSubject.next(null);
  }

  setUserRoles(roles: string[]): void {
    this.userRoles = roles; // Ustaw role użytkownika
  }

  getUserRoles2(): string[] {
    return this.userRoles; // Zwróć role użytkownika
  }

  setUserData(data: any): void {
    this.userData = data; // Ustaw dane użytkownika
  }

  getUserData(): any {
    return this.userData; // Zwróć dane użytkownika
  }

  logout2(): void {
    localStorage.removeItem(this.tokenKey);
    this.loginStatus.next(false);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token); // Store token in local storage
    this.loginStatus.next(true);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey); // Retrieve token from local storage
  }
  
  isLoggedIn(): boolean {
    // return !!this.getToken(); // Check if token exists
    return !!localStorage.getItem('discordToken');
  }

  // Method to initiate login with Discord
  loginWithDiscord(): void {
    const redirectUri = encodeURIComponent('http://localhost:5000/auth/discord/callback');
    //AUTH
    // const clientId = '1304093864877096970'; // Replace with your Discord client ID
    //NEXT
    const clientId = '1077334524154876026'; // Replace with your Discord client ID 
    const scope = 'identify guilds';
    // const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('http://localhost:4500/discord-callback')}&response_type=code&scope=identify%20guilds`;

    //WORKING localhost
    // const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('http://localhost:4500/discord-callback')}&response_type=code&scope=identify%20guilds%20guilds.members.read
    // `;

    //PRODUCTION
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent('https://mohsh.pl/discord-callback')}&response_type=code&scope=identify%20guilds%20guilds.members.read
    `;
    
    window.location.href = discordAuthUrl; // Redirect to Discord's OAuth page
  }
}