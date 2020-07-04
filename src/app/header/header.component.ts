import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';
import { SAVE_NOTE } from '../action.type.constant';
import { MainService } from '../main/services/main.service';

@Component({
  selector: 'notes-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private ngRedux: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  saveNote() {
    this.mainService.noteClear.next(true);
    this.ngRedux.dispatch({type: SAVE_NOTE});
  }

}
