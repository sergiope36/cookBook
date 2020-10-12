import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TriggersService {
  public login: boolean;

  constructor() {
    this.login = false;

  }
}
