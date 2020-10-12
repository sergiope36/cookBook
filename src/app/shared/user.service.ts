import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Recipe } from 'src/app/models/recipe';
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {User} from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = "http://localhost:3000/user";
  public userProfile: User;
  public allUsers;
  public userRecipes: Recipe[];
  public teacher;

  constructor(private http: HttpClient, private router: Router, public afAuth: AngularFireAuth, private afs: AngularFirestore, private localStorage: LocalStorageService) {
  }

    getUsers() {
      this.allUsers = this.http.get(this.url);
      return this.allUsers;
    }

    getUser(id: any) {
      return this.http.get(this.url + "/" + id);
  }

    getLessonfromUser(id_lesson){
      this.teacher = this.http.get(this.url + '/lesson/' + id_lesson)
      return this.teacher;
    }

    loginUser(user:User){
      return this.http.post(this.url + '/login', user);
    }

    registerUser (newUser: User) {
      return this.http.post(this.url + '/register', newUser)
    }
    

    editUserProfile (editUser: User) {
      return this.http.put(this.url + '/edit_profile', editUser)
    }

    registerSocial(provider) {

      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

      this.afAuth.authState.subscribe( user => {
        if (!user){
            return;
        }

        this.userProfile = {
            email: user.email,
            user_name: user.displayName,
            picture: user.photoURL,
            password:"123"
        };

        this.getUsers().subscribe((data) => {
          const dataFiltered = data.filter(item => item.email === this.userProfile.email);
          if (dataFiltered.length === 0) {
              this.http.post(this.url + '/register/social' , this.userProfile).subscribe((dataUser: User) =>{
                this.router.navigate(['/', 'searchRecipe']);
              });
          } else {
            this.http.post(this.url + '/login/social', this.userProfile).subscribe((dataUser: User) =>  {
                this.userProfile = dataUser[0];
          });
          }
      });
    }); 
  }

  loginUserSocial() {
      this.afAuth.authState.subscribe( user => {
        if (!user){
            return;
        }
        this.userProfile = {
            email: user.email,
            user_name: user.displayName,
            picture: user.photoURL,
            password:"123"
        };
      });

      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      this.http.post(this.url + '/login/social', this.userProfile)
      
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          console.log(this.userProfile)
          
          this.localStorage.set('log', this.userProfile);
          this.router.navigate(['/', 'searchRecipe']);
        }
      })

      
  }

  logOutSocial() {
    this.afAuth.auth.signOut();
 
  }

  deleteUser(user_id:number) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        user_id: user_id
      },
    };

    return this.http.delete(this.url, options);
  }




}
