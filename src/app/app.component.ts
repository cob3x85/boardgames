import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { storage } from 'firebase';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Kids Games';
  image: string;

  constructor() {

  }
  ngOnInit(): void {

    // this.authService.InitFireAuthListener();

    // this.afStorage.storage.ref('/' + environment.images).listAll()
    //   .then(response => {
    //     console.log(response);
    //   });

    // this.afAuth.authState.subscribe((fbUser: firebase.User) => {
    //   if (fbUser) {
    //     // const storageRef = this.afStorage.ref('wishlist.jpg');
    //     // storageRef.getDownloadURL().subscribe(res => {
    //     // this.image = res;
    //     // });
    //   }
    // });

  }



}
