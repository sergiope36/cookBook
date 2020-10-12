import { Router } from '@angular/router';
import { LocalStorageService } from './../../shared/local-storage.service';
import { TriggersService } from './../../shared/triggers.service';
import { SearchRecipeService } from './../../shared/search-recipe.service';
import { Recipe } from 'src/app/models/recipe';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  public animation: boolean;
  public user;
  public profileUser: User;
  public recipesUser: Recipe[];
  public navigation: boolean;
  public login: boolean;

  constructor( private router: Router, private userService: UserService, public apiSearchRecipe: SearchRecipeService, public apiNavigation: TriggersService, public localStorage: LocalStorageService) {
    this.animation = false;
    this.profileUser = this.userService.userProfile;

  }

    show() {

      if (document.getElementById('edit-profile').style.visibility === 'visible') {
        this.animation = false;

        document.getElementById('edit-profile').style.visibility = 'hidden';
      } else {
        document.getElementById('edit-profile').style.visibility = 'visible';
        document.getElementById('edit-profile').style.opacity = '1';
        this.showProfile()
        this.animation = true;
      }

    }

    editProfile( password: string, email: string, picture: string){
      let user1 = new User(this.profileUser.user_name, password, email, picture,  this.profileUser.user_id);
      this.userService.editUserProfile(user1).subscribe( data => this.user = data);
      this.animation = false;
      document.getElementById('edit-profile').style.visibility = 'hidden';
      this.profileUser.picture = picture;
      this.profileUser.password = password;
      this.profileUser.email = email;
    }


    showProfile(){
      this.profileUser = this.userService.userProfile;
      this.login = this.apiNavigation.login;
    }

    deleteProfile() {
      this.userService.deleteUser(this.userService.userProfile.user_id).subscribe((data) => {
        this.userService.userProfile.user_id;
        this.profileUser = {user_name: ''};
        this.localStorage.clear();
        this.router.navigate(['/', 'welcome']);
      });
    }

    popUp2() {
      document.getElementById('edit-profile').style.visibility = 'hidden';
      this.profileUser = this.userService.userProfile.user_id;
      if ( document.getElementById('window').style.visibility === 'visible') {
          document.getElementById('window').style.visibility = 'hidden';
          this.animation = false;
      } else {
          document.getElementById('window').style.visibility = 'visible';
          document.getElementById('edit_profile').style.opacity = '1';
          this.animation = true;
      }
  
    }

    logOut(){
      this.localStorage.remove('log');
      this.localStorage.clear();
      this.userService.logOutSocial();
      this.profileUser = {user_name: ''};
      this.router.navigate(['/', 'welcome']);
    }

  ngOnInit(): void {
    this.showProfile();
    this.login = true;
  }

}
