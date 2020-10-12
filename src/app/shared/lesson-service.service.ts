import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lessons } from '../models/lessons';

@Injectable({
  providedIn: 'root'
})
export class LessonServiceService {
  private url = "http://localhost:3000/lesson";
  public lesson: Lessons[];
  public lessons: Lessons[];

constructor (private http: HttpClient) {
  this.lessons = [];
 }

  getLessons(){
    return this.http.get(this.url)
  }

  getLesson(lesson_id:number){
    return this.http.get(this.url + '/' + lesson_id)
  }

  getUserLessons(user_id){
    return this.http.get(this.url + '/user/' + user_id)
  }

  addLesson(lesson: Lessons){
    return this.http.post(this.url, lesson)
  }

  modifyLesson(lesson: Lessons){
    return this.http.put(this.url, lesson)
    }

  removeLesson(lesson_id:number){
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body:{lesson_id:lesson_id}};
      return this.http.delete(this.url, httpOptions)
  }

}
