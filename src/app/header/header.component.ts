import { Component, OnInit } from '@angular/core';
import { NoteSave, NoteDelete, NoteSearch } from '../store/actions/notes.actions';
import { NoteService } from '../main/services/note.service';
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
    private noteService: NoteService) {
    // Subscribe to store
    store.pipe(select('notes')).subscribe((data: any) => {
      this.enteredNote = data.selectedNote ? data.selectedNote.text : '';
    });
  }

  ngOnInit() {
  }

  saveNote() {
    this.noteService.focusInput.next(true);
    this.noteService.openSidebar.next(true);
    this.searchQuery = '';
    this.store.dispatch(new NoteSave(null));
  }

  removeNote() {
    this.noteService.focusInput.next(true);
    this.noteService.openSidebar.next(true);
    this.store.dispatch(new NoteDelete(null));
  }

  searchNote() {
    this.noteService.openSidebar.next(true);
    this.store.dispatch(new NoteSearch(this.searchQuery.trim()));
  }

  clearQuery() {
    this.searchQuery = '';
    this.searchNote();
  }

}
