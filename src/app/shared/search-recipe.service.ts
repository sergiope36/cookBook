import { Ingredients } from './../models/ingredients';
import { Recipe } from 'src/app/models/recipe';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SearchRecipeService {
  private url = 'http://localhost:3000';

  public resultRecipes: Recipe[];
  public resultRecipe: Recipe;
  public ingredients: Ingredients[];

  constructor(private http: HttpClient) {
      this.resultRecipes = [];

  }

  showIngredients() {
    return this.http.get(this.url + '/ingredients');
  }

  showRecipes() {
    return this.http.get(this.url + '/');
  }

  showRecipesUser(id: number) {
    return this.http.get(this.url + '/recipe/' + id);
}

  searchRecipes(ingredients: string) {
    return this.http.get(this.url + ingredients);
  }

  newRecipes(recipe: Recipe) {
    return this.http.post(this.url + '/recipes', recipe); 
  }

  updateRecipe(recipe: Recipe) {
    return this.http.put(this.url + '/recipes/update', recipe);
  }

  deleteRecipe(id: number) {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json' }),
        body:{
          id: id
        }};
    return this.http.delete(this.url, httpOptions);
  }



}
