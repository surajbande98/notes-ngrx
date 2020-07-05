import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { SAVE_NOTE, DELETE_NOTE, SEARCH_NOTE } from '../action.type.constant';
import { MainService } from '../main/services/main.service';
import { IAppState } from '../store/app-state.interface';

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
    this.mainService.openSidebar.next(true);
    this.searchQuery = '';
    this.ngRedux.dispatch({ type: SAVE_NOTE });
  }

  deleteNote() {
    this.mainService.noteClear.next(true);
    this.mainService.openSidebar.next(true);
    this.searchQuery = '';
    this.ngRedux.dispatch({ type: DELETE_NOTE });
  }

  searchNote() {
    this.mainService.noteClear.next(true);
    this.mainService.openSidebar.next(true);
    this.ngRedux.dispatch({ type: SEARCH_NOTE, payload: this.searchQuery.trim() });
  }

  clearQuery() {
    this.searchQuery = '';
    this.searchNote();
  }

}
