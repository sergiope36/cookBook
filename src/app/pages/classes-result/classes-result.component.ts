import { Lessons } from './../../models/lessons';
import { Component, OnInit } from '@angular/core';
import { LessonServiceService } from "../../shared/lesson-service.service"
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-classes-result',
  templateUrl: './classes-result.component.html',
  styleUrls: ['./classes-result.component.scss']
})

export class ClassesResultComponent implements OnInit {
  public lessons: Lessons[];
  public lessonTeacher: Lessons;
  public teacher: User;
  public indice: number;
 
  constructor(private apiService: LessonServiceService, private router: Router,  private userService: UserService) { }

   obtainLessons(){
    this.apiService.getLessons().subscribe((data:Lessons[])=> {
      this.lessons = data;
      });      
  }
    
  showLesson(lesson_id){
    this.userService.getLessonfromUser(lesson_id).subscribe((data)=> {
    this.teacher = data[0];
    this.userService.teacher = data[0]
    this.router.navigate(["/", "lesson"])
  })
}


  ngOnInit(): void {
   this.obtainLessons()
  }
}
