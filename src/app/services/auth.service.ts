import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userLogged;

  get user() {
    return this.userLogged;
  }

  getUser() {
    return { ...this.userLogged }; // rompe la relacion de referencia usando SPREAD ...
  }

  constructor() { }

  InitFireAuthListener() {

    // this.afAuth.authState.subscribe((fbUser: firebase.User) => {
    //   if (fbUser) {
    //     this.userLogged = fbUser;
    //     console.log(fbUser);
    //   }
    // });
  }

}
