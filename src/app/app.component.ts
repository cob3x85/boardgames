import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Kids Games';
  image: string;

  constructor(private authService: AuthService, private afAuth: AngularFireAuth) {

  }
  ngOnInit(): void {
    this.afAuth.signOut();
    this.afAuth.signInAnonymously()

      .catch(error => {
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          timer: 1800,
          text: 'Auth error',
          titleText: 'Error',
          icon: 'error',
          showConfirmButton: false
        });
      });

    this.authService.InitFireAuthListener();

  }



}
