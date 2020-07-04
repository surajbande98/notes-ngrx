import { Component, OnInit, OnChanges } from '@angular/core';
import { IAppState, Note } from 'src/app/store';
import { NgRedux, select } from '@angular-redux/store';
import { SHOW_NOTE } from 'src/app/action.type.constant';
import { MainService } from '../../services/main.service';

declare var moment;

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
          this.note.title = '';
        }
      });
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

  initializeDefaultNote() {
    this.note = {
      id: new Date().getTime(),
      title: '',
      text: 'No additional t...', // 15 chars
      createdDate: new Date(),
      isSelected: false
    }
  }

  addNote() {
    this.ngRedux.dispatch({ type: SHOW_NOTE, payload: this.note });
  }

  getAuthTimeStamp() {
    return setInterval(() => {
      this.now = Date.now();
    }, 1);
  }

}
