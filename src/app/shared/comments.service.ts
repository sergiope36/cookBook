import { Comments } from './../models/comments';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private url = 'http://localhost:3000';
  public comments: Comments [];
  public comment: Comments;
  public numberComment: number;

  constructor(private http: HttpClient) {
  }

  showComments(id: number) {
    return this.http.get(this.url + '/comments/' + id);
  }

  createComment(comment: Comments) {
    return this.http.post(this.url + '/comment/', comment);
  }

  numberComments(id: number) {
    return this.http.get(this.url + '/comments_number/' + id);
  }
  
}
