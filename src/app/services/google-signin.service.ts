import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleSigninService {

  private auth2: gapi.auth2.GoogleAuth
  private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1)

  constructor() { 
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '326844544836-6tqb426dh5sl8opmnh7difha0t0lgq9t.apps.googleusercontent.com'
      })
    })
  }

  public signIn(){
    this.auth2.signIn({
      // scope: 'https://www.googleapis.com/auth/gmail.readonly'
      scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/spreadsheets'
      // scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.scriptapp https://www.googleapis.com/auth/script.external_request'
    }).then( user => {
      console.log('user', user);
      this.subject.next(user)
    }).catch( () => {
      this.subject.next(null)
    })
  }

  public signOut(){
    this.auth2.signOut()
    .then( () => {
      this.subject.next(null)
    })
  }

  public observable() : Observable<gapi.auth2.GoogleUser>{
    return this.subject.asObservable()
  }
}
