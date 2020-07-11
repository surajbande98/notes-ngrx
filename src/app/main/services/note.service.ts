import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  openSidebar = new Subject<boolean>();

  focusInput = new Subject<boolean>();

  constructor() { }
}
