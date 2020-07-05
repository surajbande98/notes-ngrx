import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { select, NgRedux } from '@angular-redux/store';
import { GET_NOTES, EDIT_NOTE } from 'src/app/action.type.constant';
import { UtilityService } from 'src/shared/services/utility.service';
import { Observable, Subscription } from 'rxjs';
import { Note } from 'src/app/store/note.interface';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MainService } from '../../services/main.service';

declare let moment;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit, OnDestroy {

  // Selects an observable from the store, and attaches it to the decorated property.
  @select() searchQuery: Observable<string>;

  notes: Array<Note>;

  isMobileScreenDetected: boolean = false;

  openSidebarSubscription: Subscription;

  constructor(
    public breakpointObserver: BreakpointObserver,
    private utilityService: UtilityService,
    private mainService: MainService,
    private ngRedux: NgRedux<any>) {

    //Select a slice of state to expose as an observable.
    this.ngRedux
      .select<Array<Note>>('notes')
      .subscribe((items: Array<Note>) => {
        this.notes = items;
      });

    //Select a slice of state to expose as an observable.
    this.ngRedux
      .select<string>('searchQuery')
      .subscribe((item: string) => {
        if (item) {
          this.openSidebar();
        }
      });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: GET_NOTES });

    // Check for mobile devices screen resolution
    if (this.breakpointObserver.isMatched('(max-width: 767px)')) {
      this.isMobileScreenDetected = true;
      this.closeSidebar();
    } else {
      this.isMobileScreenDetected = false;
      this.openSidebar();
    }

    this.openSidebarSubscription = this.mainService.openSidebar.subscribe((isOpen: boolean) => {
      this.openSidebar();
    })
  }

  ngOnDestroy() {
    this.openSidebarSubscription.unsubscribe();
  }

  /**
   * Selects a note
   * @param note Note
   * @returns void
   */
  selectNote(note: Note): void {
    this.ngRedux.dispatch({ type: EDIT_NOTE, payload: note });
  }

  /**
   * Truncates the title
   * @param title string
   * @returns string
   */
  truncateTitle(title: string): string {
    return title ? this.utilityService.truncateText(title, 15, '...') : 'No Title';
  }

  /**
   * closes the sidebar
   * @param 
   * @returns void
   */
  closeSidebar() {
    document.getElementById("mySidebar").style.width = "0px";
    document.getElementById("NoteArea").style.marginLeft = "0px";
  }

  /**
  * opens the sidebar
  * @param 
  * @returns void
  */
  openSidebar() {
    let sidebarWidth = '350px';
    let notesAreaMLeft = '350px';

    if (this.isMobileScreenDetected) {
      sidebarWidth = '170px';
      notesAreaMLeft = '200px';
    }

    document.getElementById("mySidebar").style.width = sidebarWidth;
    document.getElementById("NoteArea").style.marginLeft = notesAreaMLeft;
  }

}
