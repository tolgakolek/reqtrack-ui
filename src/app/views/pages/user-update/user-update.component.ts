import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { UserService } from '../../../core/auth/_services/user.service';
import { Users } from '../../../core/model/user.models';
import { UserTypeSevice } from '../../../core/auth/_services/userType.service';
import { UserType } from '../../../core/model/userType.models';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  formValidation: FormGroup;
  submitControl=false;
  alertType:string;
  alertMessage:string;
  userTypes:UserType[]=[];
  user:Users;
  userId:any;
  alertStatus=false;
  constructor(
    public formBuilder: FormBuilder,
    private userService:UserService,
    private userTypeService:UserTypeSevice,
    private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.formValidation = this.formBuilder.group({
    userName: ['', [Validators.required]],
    userSurname: ['', [Validators.required]],
    userTcNumber: ['', [Validators.required]],
    userPhone: ['', [Validators.required]],
    userAddress: ['', [Validators.required]],
    userPassword: ['', [Validators.required]],
    userEmail: ['', [Validators.required]],
    userUserTypeSelect: ['', [Validators.required]]
  });
  this.userTypeService.getAll().subscribe(res => {
    this.userTypes=res;
  }); 
  const id = +this.route.snapshot.paramMap.get('id');
  this.userService.getById(id).subscribe(res => {
    
    this.user = res;
    this.userId=this.user.id;
    this.formValidation.setValue({
      userName: this.user.name,
      userSurname: this.user.surname,
      userTcNumber: this.user.tcNumber,
      userPhone: this.user.phone,
      userPassword: "******",
      userAddress: "null geliyor",
      userEmail: this.user.email,
      userUserTypeSelect: "null geliyor",
    });
  });
  }

  submit(formDirective: FormGroupDirective) {
    this.submitControl = true;
    if (this.formValidation.status == "VALID") {
      this.user = {
        id:this.userId,
        name:this.formValidation.value.userName,
        surname:this.formValidation.value.userSurname,
        tcNumber:this.formValidation.value.userTcNumber,
        phone:this.formValidation.value.userPhone,
        password:this.formValidation.value.userPassword,
        adress:this.formValidation.value.userAddress,
        email:this.formValidation.value.userEmail,
        userTypeDto:this.formValidation.value.userUserTypeSelect
      }
      this.userService.save(this.user).subscribe(res => {
        if (res) {
          this.alertStatus=true;
          this.alertMessage="Başarılı Bir Şekilde Tamamlandı."
          this.alertType="success";
          formDirective.resetForm();
          setTimeout(() => this.router.navigateByUrl("/user-list"), 1000);
          setTimeout(()=>this.submitControl = false, 1000);
          setTimeout(()=>this.alertStatus = false, 1000);
        }
        else {
          this.alertMessage="Kaydedilirken Hata Oluştu."
          this.alertType="danger";
        }
      });
    }
  }
}

