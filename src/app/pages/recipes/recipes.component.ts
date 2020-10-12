import { SearchRecipeService } from './../../shared/search-recipe.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../models/recipe';
import { CookbookService } from '../../shared/cookbook.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  public arrow: void;
  public test: string;
  public resultRecipes: Recipe[];
  public resultRecipe: Recipe[] ;

  constructor(public apiSearchRecipe: SearchRecipeService, private cookbookService: CookbookService, private router: Router ) { }

    goBack(){

        this.arrow = this.cookbookService.backClicked();
    }

    showRecipesResult() {

        this.resultRecipes = this.apiSearchRecipe.resultRecipes;
    }

    showRecipe(i)  {
      this.resultRecipe = this.resultRecipes.filter(recipe => recipe.recipe_id === i);
      this.apiSearchRecipe.resultRecipe = this.resultRecipe[0];
      this.router.navigate(['/', 'recipe']);
    }


    ngOnInit(): void {
        this.showRecipesResult();
    }



}