import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

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

  constructor(private afAuth: AngularFireAuth ) { }

  InitFireAuthListener() {

    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.userLogged = fbUser;
      }
    });
  }

}
