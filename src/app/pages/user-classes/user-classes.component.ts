import { FollowersService } from './../../shared/followers.service';
import { Component, OnInit } from '@angular/core';
import { LessonServiceService } from 'src/app/shared/lesson-service.service';
import { UserService } from 'src/app/shared/user.service';
import { Lessons } from "../../models/lessons"
import { User } from '../../models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-classes',
  templateUrl: './user-classes.component.html',
  styleUrls: ['./user-classes.component.scss']
})
export class UserClassesComponent implements OnInit {
  public lesson:Lessons[];
  public lessons: Lessons[];
  public profile: User;
  public allMyLessons: Lessons[];
  public animation: boolean;
  public eliminar;
  public teacher: User;
  public followingAmount: number;
  public followersAmount: number;

  constructor(private apiService: LessonServiceService,public followers: FollowersService, private userService: UserService,  private router: Router) {
    this.apiService.lesson
    this.animation = false;
  }
   

  showProfile(){
    this.profile = this.userService.userProfile;
    this.followers.followAmount(this.profile.user_id).subscribe((data: number) => console.log(this.followingAmount = data));
    this.followers.followersAmount(this.profile.user_id).subscribe((data: number) => console.log(this.followersAmount = data));
  }

  showLesson(lesson_id){
    this.userService.getLessonfromUser(lesson_id).subscribe((data)=> {
      this.teacher = data[0];
      this.userService.teacher = data[0]
    this.router.navigate(["/", "lesson"])
    })
  }

  userLessons(){
      this.apiService.getUserLessons(this.userService.userProfile.user_id).subscribe((data:Lessons[])=> {
        console.log("allMyLessons",data)
        return this.lessons = data;
        });
  }

  goToFollowers() {
    this.router.navigate(['/', 'followers']);
}

  popUp(lesson_id) {
    this.eliminar = lesson_id
    if ( document.getElementById('delete-window').style.visibility === 'visible') {
        document.getElementById('delete-window').style.visibility = 'hidden';
        this.animation = false;
    } else {
        document.getElementById('delete-window').style.visibility = 'visible';
        document.getElementById('edit-profile').style.opacity = '1';
        this.animation = true;
    }
}

  deleteLesson(){
    this.apiService.removeLesson(this.eliminar).subscribe(data => this.ngOnInit());
  }

  ngOnInit(): void {
    this.showProfile();
    this.userLessons();
  }


  

}
