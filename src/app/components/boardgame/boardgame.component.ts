import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardImages } from 'src/app/models/BoardImages';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/services/image.service';
import { Subscription, Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-boardgame',
  templateUrl: './boardgame.component.html',
  styleUrls: ['./boardgame.component.scss']
})
export class BoardgameComponent implements OnInit, OnChanges, OnDestroy {

  cardsToFind: BoardImages[] = [];
  confetti = false;
  getImagesAsyncObservable = new Observable<BoardImages[]>();
  getImagesAsyncSubscription = new Subscription();
  initArray: BoardImages[] = [];
  isLoading = false;
  results: BoardImages[] = [];
  showInstructionsCounter = 0;

  @Input() category: string;
  @Input() numberCards: number;
  @Input() showBoard: boolean;

  catalog: BoardImages[] = [];

  constructor(private imageService: ImageService, private afAuth: AngularFireAuth) { }

  ngOnDestroy(): void {
    this.getImagesAsyncSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (this.numberCards > 0 && this.numberCards < 7) {
      this.initGame();
    } else if (this.numberCards != null) {
      this.isLoading = true;
      Swal.fire('Info', 'The number of cards is incorrect, the number must be between 3 and 6', 'info');
    } else {
      this.numberCards = 3;
    }

  }

  ngOnInit(): void {
    this.showInstructionsCounter = 0;
  }

  initGame() {
    if (this.imageService.currentStorageType === this.imageService.storageType.Local) {
      this.catalog = this.imageService.getImagesCatalog();
      this.startGame();
    } else {
      this.getImagesAsyncSubscription = this.afAuth.authState.subscribe((fbUser: firebase.User) => {
        if (fbUser) {
          this.getImagesAsyncObservable = this.imageService.getImagesAsync(this.category);
          this.getImagesAsyncObservable.subscribe(response => {
            this.catalog = response;
            if (this.catalog.length > 0) {
              this.startGame();
            }
          }, error => {
            Swal.fire({
              toast: true,
              position: 'bottom-right',
              timer: 1800,
              text: error,
              titleText: 'Error Catalog downloaded',
              icon: 'error',
              showConfirmButton: false
            });
          },
            () => {
              Swal.fire({
                toast: true,
                position: 'bottom-right',
                timer: 1800,
                text: 'Finish retrieving data from firebase',
                titleText: 'Catalog downloaded',
                icon: 'info',
                showConfirmButton: false
              });
            });
        }
      });
    }
  }

  startGame() {
    this.showBoard = true;
    this.confetti = false;
    this.isLoading = true;
    setTimeout(() => { // if not used it doesn't work
      this.cleanCatalogsValues();
      this.loadValidCards(); // create the cards to find
      this.startAllCards();
      this.isLoading = false;
    }, 1500);

    if (this.showInstructionsCounter === 0) {
      Swal.fire('Instructions', `<p>Find the green cards and drop them on the right side area to win </p>`, 'info');
    }
  }

  cleanCatalogsValues() {
    this.catalog.forEach(x => {
      x.valid = false;
    });
    this.cardsToFind.length = 0;
    this.initArray.length = 0;
  }

  loadValidCards() {
    this.generateCardsRandomly();
  }

  generateCardsRandomly() {
    for (let index = 0; this.cardsToFind.length < this.numberCards; index++) {
      let card: BoardImages = null;
      const randIndex = Math.floor(Math.random() * this.catalog.length);
      card = this.catalog[randIndex];
      const repeated = this.cardsToFind.find(x => {
        return x.id === card.id;
      });

      if (!repeated) {
        card.valid = true;
        this.cardsToFind.push(card);
      }
    }
  }

  startAllCards() {
    this.results = [];
    const initialCards = this.catalog.filter(e => this.cardsToFind.includes(e)); // Add existing items from cardsToFind
    const initialCards2 = this.catalog.filter(e => !this.cardsToFind.includes(e)); // Add the initial catalog items to complete the list.
    this.initArray.push(...initialCards);
    this.initArray.push(...initialCards2);

    this.shuffleArray(this.initArray);
    // console.log('6-Init array this should only have # of cards with true ', this.initArray);
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    // console.log('Shuffled array', this.initArray);
  }
  // Validate if we have finish the game
  endGame() {
    if (this.cardsToFind.length === this.results.length) {
      // Send message
      Swal.fire('Congratulations!!', 'You finished the game.', 'success')
        .then(res => {
          this.showInstructionsCounter++;
          // restart the game
          this.startGame();
        });
      this.confetti = true;
    }
  }

  // If the predicate is true then we drop the item in the new list
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    this.endGame();
  }

  /** Predicate function that only allows correct images into a list. */
  imagePredicate(item: CdkDrag<BoardImages>) {
    return item.data.valid;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }

}
