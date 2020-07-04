import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  noteClear = new Subject<boolean>();

  constructor() { }
}
