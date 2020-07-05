import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { SHOW_NOTE } from 'src/app/action.type.constant';
import { MainService } from '../../services/main.service';
import { Note } from 'src/app/store/note.interface';
import { IAppState } from 'src/app/store/app-state.interface';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.less']
})
export class NoteComponent implements OnInit {

  now: any;

  note: Note = {
    id: new Date().getTime(),
    title: 'New Note',
    text: 'No additional t...', // 15 chars
    createdDate: new Date(),
    isSelected: false
  }

  isNoteSelected: boolean = false;

  @ViewChild('inputNote') searchElement: ElementRef;

  constructor(
    private mainService: MainService,
    private ngRedux: NgRedux<IAppState>) {
    this.ngRedux
      .select('currentNote')
      .subscribe((note: Note) => {
        note ? this.isNoteSelected = true : this.isNoteSelected = false;
        if (this.isNoteSelected) {
          this.note = note;
          this.note.isSelected = true;
        } else {
          //this.note.title = '';
        }

        this.focusTheInput();
      });
  }

  /**
   * Focuses the input area
   * @param 
   * @returns void
   */
  focusTheInput() {
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    }, 1);
  }

  ngOnInit() {
    this.mainService.noteClear.subscribe(
      (isClear: boolean) => {
        if (isClear) {
          this.initializeDefaultNote()
        }
      }
    );

    this.getAuthTimeStamp();
  }

  /**
  * Creates default note
  * @param 
  * @returns void
  */
  initializeDefaultNote() {
    this.note = {
      id: new Date().getTime(),
      title: '',
      text: 'No additional t...', // 15 chars
      createdDate: new Date(),
      isSelected: false
    }
  }

  /**
  * dispactches action
  * @param 
  * @returns void
  */
  addNote() {
    this.ngRedux.dispatch({ type: SHOW_NOTE, payload: this.note });
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
