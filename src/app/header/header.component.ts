import { Component, OnInit } from '@angular/core';
import { NoteSave, NoteDelete, NoteSearch } from '../store/actions/notes.actions';
import { MainService } from '../main/services/main.service';
import { IAppState } from '../store/app-state.interface';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'notes-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  enteredNote: string;

  constructor(
    private store: Store<IAppState>,
    private mainService: MainService) {
    store.pipe(select('notes')).subscribe((data: any) => {
      this.enteredNote = data.selectedNote ? data.selectedNote.text : '';
    });
  }

  ngOnInit() {
  }

  saveNote() {
    this.mainService.openSidebar.next(true);
    this.searchQuery = '';
    this.store.dispatch(new NoteSave(null));
  }

  removeNote() {
    this.mainService.openSidebar.next(true);
    this.store.dispatch(new NoteDelete(null));
  }

  searchNote() {
    //.mainService.noteClear.next(true);
    this.mainService.openSidebar.next(true);
    this.store.dispatch(new NoteSearch(this.searchQuery.trim()));
  }

  clearQuery() {
    this.searchQuery = '';
    this.searchNote();
  }

}
