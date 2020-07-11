
export class StorageService {

  constructor() { }

  static fetchData(key: string) {
    return localStorage.getItem(key); 

  }

  static saveData(list: any) {
    localStorage.setItem('NOTES', JSON.stringify(list)); 
  }
}
