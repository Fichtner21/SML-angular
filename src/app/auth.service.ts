import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  loggedInUser(){
  }

  allUsers(){

  }

  loggedIn(){
    let hasToken = false;
    if (localStorage.getItem('tokenLogin') == 'secretToken'){
      hasToken = true;
    }
    return hasToken;
  }

  getToken(){
    return localStorage.getItem('tokenLogin');
  }

}