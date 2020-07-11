import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Note } from '../../models/note';
import { NoteAdd } from 'src/app/store/actions/notes.actions';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/app-state.interface';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.less']
})
export class NoteComponent implements OnInit {

  now: any = new Date();

  selectedNote: Note;

  notes: Note[];

  isNoteSelected: boolean = false;

  lastUpdate: string;

  @ViewChild('inputNote') inputNote: ElementRef;

  enteredNote: string;

  searchString: string;

  constructor(
    private store: Store<IAppState>) {
    store.pipe(select('notes')).subscribe((data: any) => {
      this.selectedNote = data.selectedNote;
      this.enteredNote = data.selectedNote ? data.selectedNote.text : '';
      this.searchString = data.searchQuery;
      this.notes = data.notes;

      if(!this.searchString && this.selectedNote) {
        this.focusTheInput();
      }
    });
  }

  /**
   * Focuses the input area
   * @param 
   * @returns void
   */
  focusTheInput() {
    setTimeout(() => {
      this.inputNote.nativeElement.focus();
    }, 1);
  }

  ngOnInit() {
    if(!this.searchString) {
      this.focusTheInput();
    }
    this.getAuthTimeStamp();
  }

  /**
  * dispactches action
  * @param 
  * @returns void
  */
  addNote() {

    const note = new Note();

    note.id = this.selectedNote ? this.selectedNote.id : new Date().getTime();

    note.text = this.enteredNote.trim();

    note.title = '';

    note.isSelected = this.selectedNote ? this.selectedNote.isSelected : false;

    note.createdDate = new Date().toString();

    this.store.dispatch(new NoteAdd(note));
  }

  /**
 * Gives current time stamp string
 * @param 
 * @returns void
 */
  getAuthTimeStamp() {
    return setInterval(() => {
      this.now = Date.now();
    }, 1);
  }

}
