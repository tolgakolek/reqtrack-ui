import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../core/model/category.models';
import { CategoryService } from '../../../core/auth/_services/category.service';
import { Department } from '../../../core/model/department.models';
import { DepartmentService } from '../../../core/auth/_services/department.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'kt-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent implements OnInit {

  formValidation: FormGroup;
  submitControl=false;
  alertType:string;
  alertMessage:string;
  category:Category;
  departmentId=1;
  departments:Department[]=[];
  alertStatus=false;
  constructor(
    public formBuilder: FormBuilder,
    private categoryService:CategoryService,
    private departmentService:DepartmentService, 
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.formValidation = this.formBuilder.group({
    categoryName: ['', [Validators.required]],
    categoryDescription: ['', [Validators.required]],
    departmentSelect:['', [Validators.required]]
  });
  this.departmentService.getAll().subscribe(res => {
    this.departments=res;
  });
  const id = +this.route.snapshot.paramMap.get('id');
  this.categoryService.getById(id).subscribe(res =>{
    this.category=res;
    //this.departmentId=this.category.departmentDto.id;
    this.formValidation.setValue({
      categoryName: this.category.name,
      categoryDescription: this.category.description,
      departmentSelect: this.category.departmentDto,
    });
  });
  }

  submit() {
    this.submitControl = true;
    if (this.formValidation.status == "VALID") {
      this.category = {
        name:this.formValidation.value.categoryName,
        description:this.formValidation.value.categoryDescription,
        departmentDto: this.formValidation.value.departmentSelect
      }
      
      this.categoryService.update(this.category).subscribe(res => {
        if (res) {
          this.alertMessage="Başarılı Bir Şekilde Tamamlandı."
          this.alertType="success";
          this.alertStatus=true;
          setTimeout(()=>this.submitControl = false, 1000);
          setTimeout(()=>this.formValidation.reset(), 1000);
          setTimeout(()=>this.alertStatus = false, 1000);
        }
        else {
          this.alertStatus=true;
          this.alertMessage="Kaydedilirken Hata Oluştu."
          this.alertType="danger";
        }
      },
      err => {
        if(err){
          this.alertStatus=true;
          this.alertMessage="Kaydedilirken Hata Oluştu."
          this.alertType="danger";
        }
      });
    }
  }

}
