import { Component, OnInit } from '@angular/core';
import { CookbookService } from 'src/app/shared/cookbook.service';
import { Lessons } from './../../models/lessons';
import { LessonServiceService } from "../../shared/lesson-service.service"
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {
  public arrow: void;
  public lesson: Lessons[];
  public lessonTeacher: Lessons;
  public teacher;

  constructor(private cookbookService: CookbookService,private apiService: LessonServiceService, private userService: UserService){ 
      this.lesson;
      this.teacher = this.userService.teacher;
  }

  goBack(){
      this.arrow = this.cookbookService.backClicked();
  }
 
  ngOnInit(): void {
  }

}
