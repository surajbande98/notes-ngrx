import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { SAVE_NOTE, DELETE_NOTE, SEARCH_NOTE } from '../action.type.constant';
import { MainService } from '../main/services/main.service';

@Component({
  selector: 'notes-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';

  constructor(
    private mainService: MainService,
    private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  saveNote() {
    this.mainService.noteClear.next(true);
    this.ngRedux.dispatch({ type: SAVE_NOTE });
  }

  deleteNote() {
    this.mainService.noteClear.next(true);
    this.ngRedux.dispatch({ type: DELETE_NOTE });
  }

  searchNote() {
    this.mainService.noteClear.next(true);
    this.ngRedux.dispatch({ type: SEARCH_NOTE, payload: this.searchQuery.trim() });
  }

}
