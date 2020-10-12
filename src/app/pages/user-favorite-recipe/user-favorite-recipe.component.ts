import { SearchRecipeService } from './../../shared/search-recipe.service';
import { FollowersService } from './../../shared/followers.service';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { CookbookService } from 'src/app/shared/cookbook.service';
import { Router } from '@angular/router';
import { FavoriteService } from 'src/app/shared/favorite.service';
import { UserService } from 'src/app/shared/user.service';
import { CommentsService } from 'src/app/shared/comments.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-user-favorite-recipe',
  templateUrl: './user-favorite-recipe.component.html',
  styleUrls: ['./user-favorite-recipe.component.scss']
})
export class UserFavoriteRecipeComponent implements OnInit {
  public profile: User;
  public favoriteRecipes;
  public eliminar;
  public animation: boolean;
  public followingAmount: number;
  public followersAmount: number;
  public favs;
  public following;
  public count: number;
  public numberComment;
  public resultRecipe: Recipe[];



    constructor(public apiComments: CommentsService, private servicio: CookbookService, public followers: FollowersService, private router: Router,  private userService: UserService, private apiSearchRecipe: SearchRecipeService, private favService:  FavoriteService) {
      this.animation = false;
      this.favs  =  this.favService.favoriteRecipe;
      this.numberComment = this.apiComments.numberComment;
      this.following = this.followers.following;

    }
  
    showProfile(){
        this.profile = this.userService.userProfile;
        this.followers.followAmount(this.profile.user_id).subscribe((data: number) => this.followingAmount = data);
        this.followers.followersAmount(this.profile.user_id).subscribe((data: number) => this.followersAmount = data);
        this.favService.getFavoritefromUser(this.userService.userProfile.user_id).subscribe((data) => this.resultRecipe = data)
    }

   
    goToRecipe(recipe_id: number) {
      [this.apiSearchRecipe.resultRecipe] = this.resultRecipe.filter(recipe => recipe.recipe_id === recipe_id);
      this.router.navigate(['/', 'recipe']);
    }

    popUp(user_fav_id) {
      this.eliminar = user_fav_id
      if ( document.getElementById('delete-window').style.visibility === 'visible') {
          document.getElementById('delete-window').style.visibility = 'hidden';
          this.animation = false;
      } else {
          document.getElementById('delete-window').style.visibility = 'visible';
          document.getElementById('edit-profile').style.opacity = '1';
          this.animation = true;
      }
    }

    goToFollowers() {
      this.router.navigate(['/', 'followers']);
    }

    deleteFav(){
       this.favService.removeFavorite(this.eliminar).subscribe(data => this.ngOnInit());
    }


  ngOnInit(): void {
      this.showProfile();
  }

}
