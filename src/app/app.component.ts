import { Component } from '@angular/core';

@Component({
  selector: 'notes-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'Notes Taker';
  
  constructor() {
    localStorage.clear();
  }
}
