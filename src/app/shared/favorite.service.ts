import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Favorite } from "../models/favorite"

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private url = "http://localhost:3000/favorite"
  private url2 = "http://localhost:3000/fav"
  public favoriteRecipe;
  public owner;

  constructor(private http: HttpClient) { }


 getFavoritefromUser(id_user:number){
    this.owner= this.http.get(this.url + '/user/' + id_user)
    console.log("favorita", this.owner);
    return this.owner;
  }

  comprobarFav(fav:Favorite){
    return this.http.post(this.url2 , fav);
  }

  addFavorite(favorite:Favorite){
    return this.http.post(this.url, favorite);
  }

  removeFavorite(user_fav_id:number){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),body:{user_fav_id:user_fav_id}};
    return this.http.delete(this.url, httpOptions);
}


}
