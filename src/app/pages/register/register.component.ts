import { Component, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';
import { LocalStorageService } from './../../shared/local-storage.service';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ModalService } from 'src/app/_modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public user: User;
  public forma: FormGroup;
  public regis: boolean;
  public bodyText: string;

  constructor( private modalService:ModalService ,private fb : FormBuilder, private userService: UserService, private router: Router, private localStorage: LocalStorageService) {
  
    this.createForm();
    this.regis = false;
  }

  registerSocial(provider){
    this.userService.registerSocial(provider);
  }
  
  openModal(id: string){
    this.modalService.open(id);
  }
  closeModal(id: string){
    this.modalService.close(id);

  }
  ngOnInit(): void {
    this.bodyText = 'Usuario registrado';
  }

  get invalidName(){
    return this.forma.get('user_name').invalid && this.forma.get('user_name').touched;
  }

  get invalidEmail(){
    return this.forma.get('email').invalid && this.forma.get('email').touched;
  }
  get invalidPassword(){
    return this.forma.get('password').invalid && this.forma.get('password').touched;
  }

  get invalidConfirmPassword(){
    return this.forma.get('confirmPassword').invalid && this.forma.get('confirmPassword').touched;
  }

  get f(){
    return this.forma.controls;
  }


  createForm(){
    this.forma = this.fb.group({

      user_name : ['',[Validators.required]],
      email     : ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password  : ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword : ['', [Validators.required, Validators.minLength(8)]]
    },
       { 
      validator: this.confirmedValidator('password', 'confirmPassword')
  });
  
}
   confirmedValidator(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

  save(forma){     
      if(this.forma.valid){
        this.userService.getUsers().subscribe((data: User[])=>{
        const dataFiltered = data.filter(item => item.user_name === this.forma.value.user_name);
        if(dataFiltered.length === 0){
          this.userService.registerUser(new User(this.forma.value.user_name,this.forma.value.password,this.forma.value.email)).subscribe((data1: any) => {
            this.userService.getUser(data1.insertId).subscribe((data:User)=>{
              this.userService.userProfile = data[0];
              this.localStorage.set('log', this.userService.userProfile);
              this.forma.reset();
            })
            this.openModal("register-ok")

            })
  
            }else{

              this.regis = true;
            }
          })
          if(this.forma.invalid){
            Object.values( this.forma.controls ).forEach ( control =>{
              control.markAsTouched();
            });
          };
  }

}}

