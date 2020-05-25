import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  categorySelected: 'PlantsVsZombies';
  dataContent = 'local';
  sizeSelected: string;
  numberCards: number;
  showBoard = false;

  constructor() { }

  ngOnInit(): void {
    this.numberCards = 3; // initial value
  }

}
