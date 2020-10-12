import { AngularFirestore } from '@angular/fire/firestore';
import { LocalStorageService } from './../../shared/local-storage.service';
import { TriggersService } from './../../shared/triggers.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public animation: boolean;
  public user: User;
  public logIn: boolean;

  constructor(private userService: UserService, private router: Router, public apiNavigation: TriggersService, private localStorage: LocalStorageService, public afAuth: AngularFireAuth, private afs: AngularFirestore) {

    this.animation = false;
    this.user = <User>{};
    this.apiNavigation.login = false;
    this.logIn = false;
  }

    show() {

      if (document.getElementById('edit-profile').style.visibility === 'visible') {
        this.animation = false;
        document.getElementById('edit-profile').style.visibility = 'hidden';
      } else {
        this.animation = true;
        document.getElementById('edit-profile').style.visibility = 'visible';
        document.getElementById('edit-profile').style.opacity = '1';

      }

    }

    onSubmit(userForm: NgForm) { 
      this.user = new User(userForm.value.user_name, userForm.value.password);
      this.userService.userProfile = this.user;

      if(userForm.valid){
        this.userService.getUsers().subscribe((data: User []) => {
          const dataFiltered = data.filter(item => item.password === this.userService.userProfile.password);

          if(dataFiltered.length === 0){
            this.logIn = true;

          }else{
            this.userService.userProfile = dataFiltered[0];
            this.localStorage.set('log', this.userService.userProfile);
            this.router.navigate(['/', 'searchRecipe']);

          }
        });
      }
      if(userForm.invalid){
        Object.values( userForm.controls ).forEach ( control =>{
          control.markAsTouched();
        });
      }
    }


  ngOnInit(): void {


  }



}

