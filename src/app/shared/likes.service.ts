import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Likes } from '../models/likes';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private url = "http://localhost:3000/likes"
  private url2  = "http://localhost:3000/likes2"
  public likes:number;

  constructor(private http: HttpClient) { }

  comprobarLikes(like: Likes){
    return this.http.post(this.url2 , like)
  }

  getRecipeLikes(recipe_id:number){
      return this.http.get(this.url + '/' + recipe_id);
  }

  addLike(like:Likes){
    return this.http.post(this.url, like);
  }

  removeLike(likes_id:number){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body:{likes_id:likes_id}};
    return this.http.delete(this.url, httpOptions);
}

}
