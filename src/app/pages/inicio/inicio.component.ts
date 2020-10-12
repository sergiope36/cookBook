import { User } from './../../models/user';
import { UserService } from 'src/app/shared/user.service';
import { LocalStorageService } from './../../shared/local-storage.service';
import { TriggersService } from './../../shared/triggers.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  
  public animation: boolean;
  public test: boolean;
  public count: number;
 
  constructor(public apiNavigation: TriggersService, public localStorage: LocalStorageService, public userService: UserService, private router: Router) {
    this.animation = false;
    this.count = 0;

  }

  show() {
    if (document.getElementById('quienes-somos').style.visibility === 'visible') {
      this.animation = false;

      document.getElementById('quienes-somos').style.visibility = 'hidden';
    } 
    else {
      document.getElementById('quienes-somos').style.visibility = 'visible';
      document.getElementById('quienes-somos').style.opacity = '1';
      this.animation = true;
    }
  }

  hide() {
    this.count++;

    if (document.getElementById('quienes-somos').style.visibility === 'visible' && this.count > 1) {
      this.animation = false;
      document.getElementById('quienes-somos').style.visibility = 'hidden';
      this.count = 0;
    }
    else {
      return;
    }

  }

  ngOnInit(): void {
    this.logInKeep();
  }

  logInKeep() {
    if (this.localStorage.get('log') !== null) {
      this.userService.loginUser(this.localStorage.get('log')).subscribe((data: User) => {
        this.userService.userProfile = data[0];
        this.router.navigate(['/', 'searchRecipe']);

      });
    } else {
      return;
    }
  }

}
