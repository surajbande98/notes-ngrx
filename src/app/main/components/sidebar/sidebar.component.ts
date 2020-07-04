import { Component, OnInit, OnChanges } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { IAppState, Note } from 'src/app/store';
import { GET_NOTES, EDIT_NOTE } from 'src/app/action.type.constant';
import { UtilityService } from 'src/shared/services/utility.service';

declare let moment;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit, OnChanges {
  
  notes: Array<Note>;

  @select() searchQuery: string;

  constructor(
    private utilityService: UtilityService,
    private ngRedux: NgRedux<IAppState>) {
    this.ngRedux
      .select<Array<Note>>('notes')
      .subscribe((items: Array<Note>) => {
        this.notes = items;
      });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: GET_NOTES });
  }

  ngOnChanges() {
    console.log(this.notes);
  }

  selectNote(note: Note) {
    this.ngRedux.dispatch({ type: EDIT_NOTE, payload: note });
  }

  truncateTitle(title: string): string {
    return title ? this.utilityService.truncateText(title, 15, '...') : 'New Title';
  }

  getTime(date: string) {
    return moment(date).format('hh:mm');
  }

}
