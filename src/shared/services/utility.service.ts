import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  /* This is the truncateText function
   * @param str string
   * @param length string 30
   * @param ending string
   * @returns string
   */
  truncateText(str: string, length: number = 30, ending: string): string {
    if (ending == null) {
      ending = "...";
    }

    if (str.length > length) {
      return str.substring(0, length).trim() + ending;
    } else {
      return str;
    }
  }

}
