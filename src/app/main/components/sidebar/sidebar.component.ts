import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { NoteFetch, NoteSelect } from 'src/app/store/actions/notes.actions';
import { UtilityService } from 'src/shared/services/utility.service';
import { Observable, Subscription } from 'rxjs';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MainService } from '../../services/main.service';
import { Note } from '../../models/note';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/app-state.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less']
})
export class SidebarComponent implements OnInit, OnDestroy {

  // Selects an observable from the store, and attaches it to the decorated property.
  notes: Note[];

  isMobileScreenDetected: boolean = false;

  openSidebarSubscription: Subscription;

  constructor(
    private store: Store<IAppState>,
    public breakpointObserver: BreakpointObserver,
    private utilityService: UtilityService,
    private mainService: MainService) {

    store.pipe(select('notes')).subscribe((data: any) => {
      this.notes = data.notes;
    });
  }

  ngOnInit() {
    this.store.dispatch(new NoteFetch('NOTES'));

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
    this.store.dispatch(new NoteSelect(note));
  }

  /**
   * Truncates the title
   * @param title string
   * @returns string
   */
  truncateTitle(title: string): string {
    return title ? this.utilityService.truncateText(title, 15, '...') : '';
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
