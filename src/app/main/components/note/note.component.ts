import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { Note } from '../../models/note';
import { NoteAdd } from 'src/app/store/actions/notes.actions';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/app-state.interface';
import { Subscription } from 'rxjs';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'add-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.less']
})

export class NoteComponent implements OnInit, OnDestroy {

  now: any = new Date();

  selectedNote: Note;

  notes: Note[];

  isNoteSelected: boolean = false;

  lastUpdate: string;

  @ViewChild('inputNote') inputNote: ElementRef;

  enteredNote: string;

  searchString: string;

  focusInputSubscription: Subscription;

  constructor(
    private store: Store<IAppState>,
    private noteService: NoteService) {
    
    // Subscribe to the store / listen for store changes
    store.pipe(select('notes')).subscribe((data: any) => {
      this.selectedNote = data.selectedNote;
      this.enteredNote = data.selectedNote ? data.selectedNote.text : '';
      this.searchString = data.searchQuery;
      this.notes = data.notes;

      if (!this.searchString && this.selectedNote) {
        this.focusTheInput();
      }
    });
  }

  ngOnInit() {
    this.focusInputObserver();

    if (!this.searchString) {
      this.focusTheInput();
    }
    this.getAuthTimeStamp();
  }

  /**
  * Focus input control observer
  * @param 
  * @returns void
  */
  focusInputObserver(): void {
    this.focusInputSubscription = this.noteService.focusInput.subscribe((isFocus: boolean) => {
      if (isFocus) {
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

  /**
  * Dispatch action - Adds / updates new note
  * @param 
  * @returns void
  */
  addNote(): void {

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
 * @returns any
 */
  getAuthTimeStamp(): any {
    return setInterval(() => {
      this.now = Date.now();
    }, 1);
  }

  ngOnDestroy() {
    this.focusInputSubscription.unsubscribe();
  }

}
