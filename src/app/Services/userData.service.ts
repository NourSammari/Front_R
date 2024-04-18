import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class userData{
  private readonly userDataKey = 'userData';

  constructor() { }

  getUserData(): any {
    return JSON.parse(localStorage.getItem(this.userDataKey));
  }

  setUserData(userData: any): void {
    localStorage.setItem(this.userDataKey, JSON.stringify(userData));
  }
}
