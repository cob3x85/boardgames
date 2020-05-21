import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardImages } from 'src/app/models/BoardImages';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boardgame',
  templateUrl: './boardgame.component.html',
  styleUrls: ['./boardgame.component.scss']
})
export class BoardgameComponent implements OnInit, OnChanges {

  cardsToFind: BoardImages[] = [];
  confetti = false;
  initArray: BoardImages[] = [];
  isLoading = false;
  results: BoardImages[] = [];
  showInstructionsCounter = 0;

  @Input() numberCards: number;
  @Input() showBoard: boolean;

  catalog: BoardImages[] = [
    { url: 'assets/images/memorama/Mummy.png', id: 1 },
    { url: 'assets/images/memorama/mummy2.png', id: 2 },
    { url: 'assets/images/memorama/newspaper.png', id: 3 },
    { url: 'assets/images/memorama/football.png', id: 4 },
    { url: 'assets/images/memorama/vaquero1.png', id: 5 },
    { url: 'assets/images/memorama/planta.png', id: 6 },
    { url: 'assets/images/memorama/pirata.png', id: 7 },
    { url: 'assets/images/memorama/Globo.png', id: 8 },
  ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.numberCards > 0 && this.numberCards < 7) {
      this.startGame();
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
