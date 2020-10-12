import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgOption } from '@ng-select/ng-select';
import { Ingredients } from './../../models/ingredients';
import { Followed } from './../../models/followed';
import { FollowersService } from './../../shared/followers.service';
import { User } from './../../models/user';
import { Comments } from './../../models/comments';
import { UserService } from 'src/app/shared/user.service';
import { CommentsService } from './../../shared/comments.service';
import { Recipe } from 'src/app/models/recipe';
import { SearchRecipeService } from './../../shared/search-recipe.service';
import { Component, OnInit } from '@angular/core';
import { CookbookService } from 'src/app/shared/cookbook.service';
import { FavoriteService } from 'src/app/shared/favorite.service';
import { LikesService } from 'src/app/shared/likes.service'
import { Favorite } from 'src/app/models/favorite';
import { Likes} from 'src/app/models/likes';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})

export class RecipeComponent implements OnInit {
  public resultRecipe: Recipe;
  public colorHat: boolean;
  public count: number;
  public animation: boolean;
  public arrow: void;
  public comments: Comment[];
  public numberComment: number;
  public user: User;
  public nuevoFavorito;
  public follow: Followed;
  public triggerFollow: boolean;
  public hideDiv: boolean;
  public likes: number;
  public ingredientsRecipe;
  public ingredientsSelected;
  public ingredients: Ingredients[];
  public dropdownList: NgOption[];
  public form: FormGroup;
  public update: boolean;
  public updateOwner: boolean;
  public favorites: boolean;

    constructor( public router: Router, private fb: FormBuilder, private likeService: LikesService, private favService: FavoriteService, private userService: UserService, public apiSearchRecipe: SearchRecipeService, private cookbookService: CookbookService, public apiComments: CommentsService, public followers: FollowersService) {
      this.hideDiv = false;
      this.ingredientsSelected = [];
      this.update = false;
      this.animation = false;
      this.updateOwner = false;
    } 

    showRecipeResult() {
        this.followers.followStatus = false;
        this.favorites = false;
        this.resultRecipe = this.apiSearchRecipe.resultRecipe;
        this.ingredientsRecipe = this.resultRecipe.ingredients.replace(/,/g, ', ').split(', ');
        this.userService.getUser(this.resultRecipe.user_id).subscribe((data: User) => this.user = data[0]);
        this.followers.getFollowingStatus(this.userService.userProfile.user_id, this.resultRecipe.user_id).subscribe((data) => {
              if (this.userService.userProfile.user_id ===  this.apiSearchRecipe.resultRecipe.user_id) {
                  return this.hideDiv = true;
              } else if (data[0].status === 'true') {
                  return this.followers.followStatus = data[0].status;
              }
          });

        this.userService.getUser(this.resultRecipe.user_id).subscribe((data: User) => this.user = data[0]);
        this.apiComments.showComments(this.resultRecipe.recipe_id).subscribe((data: Comment[]) => this.comments = data);
        this.apiComments.numberComments(this.resultRecipe.recipe_id).subscribe((data) =>  {
            this.numberComment = data[0].count;
            this.apiComments.numberComment = this.numberComment;

         });

        if (this.resultRecipe.user_id === this.userService.userProfile.user_id) {
            this.updateOwner = true;
        }

        this.form = this.fb.group({
            titulo: [ this.resultRecipe.title, Validators.minLength(5)],
            ingredientes: [Validators.minLength(1)],
            duracion: [this.resultRecipe.duration, [Validators.minLength(1), Validators.maxLength(7)]],
            dificultad: [this.resultRecipe.dificulty],
            comida: [this.resultRecipe.type],
            descripcion: [this.resultRecipe.description, Validators.minLength(20)],
            foto: [this.resultRecipe.picture]
        });

        this.likesNumber();

        let myFav = new Favorite(0, this.resultRecipe.recipe_id, this.userService.userProfile.user_id);
        this.favService.comprobarFav(myFav).subscribe((data: any) =>  {
            if (data.length !== 0 ) {
            this.favorites = true;
            } else {
                this.favorites = false;
            }
        });

        let like = new Likes (this.userService.userProfile.user_id,this.resultRecipe.recipe_id,0)
        this.likeService.comprobarLikes(like).subscribe((data: any) =>{
            if(data.length != 0 ) {
              this.colorHat = true;
            }else {
                this.colorHat = false;
            }
        });

    }

    postComment(description: string, recipe_id: number){

        let comment = new Comments(this.userService.userProfile.user_name, description, this.resultRecipe.recipe_id, this.userService.userProfile.user_id);
        this.apiComments.createComment(comment).subscribe((data) => {
            this.showRecipeResult();
            this.ngOnInit;
      });

        this.apiComments.numberComments(recipe_id).subscribe((data: number) => {
            this.numberComment = data;
            this.apiComments.numberComment = this.numberComment;
      });

        let textarea = <HTMLInputElement>document.getElementById('textarea');
        if(textarea.value !== textarea.defaultValue) {
            textarea.value = textarea.defaultValue;
        }

    }

    unfollow() {
        this.followers.unfollow(this.resultRecipe.user_id, this.userService.userProfile.user_id).subscribe((data) => {
            this.followers.followStatus = false;
        });
    }


    followUser(){
      let seguidor = new Followed(this.resultRecipe.user_id, this.userService.userProfile.user_id, true)
        this.followers.nuevoSeguidor(seguidor).subscribe((data)=> {});
        this.followers.followStatus = true;
    }

    addFav(){
      let myFav = new Favorite(0, this.resultRecipe.recipe_id, this.userService.userProfile.user_id)
      this.favService.comprobarFav(myFav).subscribe((data: any) => {
        if(data.length>0){
          myFav=data[0]
          this.favorites = false;
         this.favService.removeFavorite(myFav.user_fav_id).subscribe((data)=>{})
        }else {
          this.favService.addFavorite(myFav).subscribe((data)=> {
            this.favorites = true;
        });
      }
    });
    }

    addLike(){
        let like = new Likes (this.userService.userProfile.user_id,this.resultRecipe.recipe_id,0)
        this.likeService.comprobarLikes(like).subscribe((data: any)=>{
            if(data.length>0){
                like = data[0]
                this.likeService.likes = data[0]
                this.colorHat = false;
                this.likeService.removeLike(like.likes_id).subscribe((data)=>{
                this.likesNumber()
            })
            }else {
                this.colorHat = true;
                this.likeService.addLike(like).subscribe((data)=> {
                  this.likesNumber();
                });
            }
        });
    }

    likesNumber(){
        this.likeService.getRecipeLikes(this.resultRecipe.recipe_id).subscribe((data)=> {
          this.likes = data[0].likes_n
          })
    }

    goBack(){
        this.arrow = this.cookbookService.backClicked();
    }


    // Getter method to access formcontrols
    get formNoValidTitle() {
        return this.form.get('titulo').invalid && this.form.get('titulo').touched;
    }

    get formNoValidTime() {
        return this.form.get('duracion').invalid && this.form.get('duracion').touched;
    }

    get formNoValidDescription() {
        return this.form.get('descripcion').invalid && this.form.get('descripcion').touched;
    }

    get formNoValidPhoto() {
        return this.form.get('foto').invalid && this.form.get('foto').touched;
    }

    showIngredients() {
        this.apiSearchRecipe.showIngredients().subscribe((data: Ingredients[]) => {
            this.ingredients = data;
            for (let i = 0; i < this.ingredients.length; i++) {
                this.dropdownList[i].ingredients = this.ingredients[i].name;
            }
        });
    }

    onAdd(event: any) {
        this.ingredientsSelected.push(event.$ngOptionLabel);
    }

    onRemove(event: any) {
        let ingredientRemove;
        let value = event.label;
        ingredientRemove = this.ingredientsSelected.filter(ingredient => ingredient !== value);
        this.ingredientsSelected = ingredientRemove;
    }
    valueDificulty(element) {
        this.fb.control(element);
    }
  
    valueFood(element){
        this.fb.control(element);
    }

    onSubmit(){
        if (this.form.invalid) {
          Object.values (this.form.controls).forEach(control =>  control.markAsTouched());

      } else {
          
        let updatedRecipe = new Recipe(this.userService.userProfile.user_id, this.form.value.titulo, this.ingredientsSelected, this.form.value.duracion, this.form.value.dificultad, this.form.value.comida, this.form.value.descripcion, this.form.value.foto, this.resultRecipe.recipe_id);

        this.apiSearchRecipe.updateRecipe(updatedRecipe).subscribe(data=>{
          
        })
        this.resultRecipe.title = this.form.value.titulo;
        this.resultRecipe.type = this.form.value.comida;
        this.resultRecipe.dificulty = this.form.value.dificultad;
        this.resultRecipe.duration =  this.form.value.duracion;
        this.resultRecipe.description =  this.form.value.descripcion;
        this.resultRecipe.picture =  this.form.value.foto;
        this.ingredientsRecipe = this.ingredientsSelected;
      }
    }

    updateRecipeBtn() {
      if (document.getElementById('udpateRecipe').style.visibility === 'visible') {
          this.animation = false;
          this.update = false;
          document.getElementById('udpateRecipe').style.visibility = 'hidden';

      } else {
          document.getElementById('udpateRecipe').style.visibility = 'visible';
          document.getElementById('udpateRecipe').style.opacity = '1';
          this.router.navigate(['/', 'recipe']);
          this.animation = true;
          this.update = true;
      }

    }

  ngOnInit(): void {
       this.showRecipeResult();
       this.showIngredients();
  }

}











