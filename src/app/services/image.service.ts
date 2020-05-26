import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { BoardImages } from '../models/BoardImages';
import { AngularFireStorage } from '@angular/fire/storage';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

// Service to retrieve the data from local or Firebase storage
export class ImageService {

  storageType = {
    'Local': 'local',
    'Firebase': 'firebase'
  };

  catalog: BoardImages[] = [];

  constructor(public authService: AuthService, private afStorage: AngularFireStorage) { }

  getImagesCatalog(): BoardImages[] {

    // console.log('Catalog of Local images', this.catalog);
    // we use only the local image catalog
    this.catalog = [
      { url: 'assets/images/memorama/Mummy.png', id: 1, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/mummy2.png', id: 2, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/newspaper.png', id: 3, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/football.png', id: 4, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/vaquero1.png', id: 5, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/planta.png', id: 6, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/pirata.png', id: 7, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/Globo.png', id: 8, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/boomerang.jpg', id: 9, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/boxer.png', id: 10, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/cowboy2.png', id: 11, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/mummy-head.png', id: 12, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/mummy-pharaone.png', id: 13, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/mummy3.png', id: 14, category: 'PlantVsZombies' },
      { url: 'assets/images/memorama/pirate-captain.png', id: 15, category: 'PlantVsZombies' }
    ];

    Swal.fire({
      toast: true,
      position: 'bottom-right',
      timer: 1800,
      text: `Catalog downloaded from Local`,
      titleText: 'Catalog downloaded',
      icon: 'info',
      showConfirmButton: false
    });

    return this.catalog;
  }

  getImagesAsync(category: string): Observable<BoardImages[]> {
    if (this.authService.user !== null) {
      const observable = new Observable<BoardImages[]>(observer => {

        // we get the value from firebase one time, not multiple times
        // saved locally to avoid pulling the data from the database
        if (this.catalog.length > 0) {
          Swal.fire({
            toast: true,
            position: 'bottom-right',
            timer: 1800,
            text: 'Finish retrieving data from cache catalog',
            titleText: 'Catalog downloaded',
            icon: 'info',
            showConfirmButton: false
          });
          // console.log('Catalog of Cache images', this.catalog);
          observer.next(this.catalog);
          return observable;
        }

        this.afStorage.storage.ref(`/${environment.images}`).listAll()
          .then(response => {
            // response.prefixes.forEach((folderRef) => {
            // console.log('folders', response);
            //   folderRef.listAll().then(res => console.log('prefixes', res.prefixes));
            //   // All the prefixes under listRef.
            //   // You may call listAll() recursively on them.
            // });
            let x = 0;
            response.items.forEach((itemRef) => {
              // All the items under listRef.
              itemRef.getDownloadURL().then(imageFb => {
                const image: BoardImages = {
                  url: imageFb,
                  category: category,
                  id: x++,
                  valid: false
                };
                this.catalog.push(image);
              })
                .catch(error => {
                  Swal.fire({
                    position: 'bottom-right',
                    timer: 1800,
                    text: error,
                    titleText: 'Error Catalog downloaded',
                    icon: 'error',
                    showConfirmButton: false
                  });
                });
            });
            console.log('Catalog of new images', this.catalog);
            observer.next(this.catalog);
            observer.complete();
          });
      });

      // const storageRef = this.afStorage.ref('wishlist.jpg');
      // storageRef.getDownloadURL().subscribe(res => {
      // this.image = res;
      // });
      Swal.fire({
        toast: true,
        position: 'bottom-right',
        timer: 1800,
        text: `Catalog downloaded from firebaseDb`,
        titleText: 'Catalog downloaded',
        icon: 'info',
        showConfirmButton: false
      });

      return observable;
    }
  }

  changeDataSource() {
    // console.log('clean catalog from image service');
    this.catalog.length = 0;
  }
}
