import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lightbox } from 'ngx-lightbox';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../../../core/auth/_services/complaint.service';
import { ComplaintGalleries } from '../../../core/model/complaint-galleries.models';
import { DomSanitizer } from '@angular/platform-browser';
import { Complaint } from '../../../core/model/complaint.models';
import { ComplaintStatus } from '../../../core/model/complaint-status.models';
import { ComplaintStatusService } from '../../../core/auth/_services/complaint-status.service';

@Component({
  selector: 'kt-view-complaint',
  templateUrl: './view-complaint.component.html',
  styleUrls: ['./view-complaint.component.scss']
})
export class ViewComplaintComponent implements OnInit {
  private _album: Array<any> = [];
  complaint: Complaint;
  lan:any;
  len:any;
  formValidation: FormGroup;
  submitControl=false;
  alertType:string;
  alertMessage:string;
  complaintStatuses:ComplaintStatus[];
  userTypeStatusId=1;
  alertStatus=false;
  constructor(
    private _lightbox: Lightbox,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private complaintStatusSevice:ComplaintStatusService,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id'); 
    this.formValidation = this.formBuilder.group({
      complaintUserName: ['', [Validators.required]],
      complaintDescription: ['', [Validators.required]],
      statusSelect:['', [Validators.required]]
    });
    this.complaintStatusSevice.getAll().subscribe(res => {
      this.complaintStatuses=res;
    });
    this.complaintService.getById(id).subscribe(res => {
      this.setImage(res.complaintGalleries);
      this.complaint=res;
      console.log(this.complaint);
      
      var location=res.location.split(",");
      this.lan=location[0];
      this.len=location[1];
      //this.userTypeStatusId=this.complaint.user.userTypeDto.id;
      this.formValidation.setValue({
        complaintUserName: this.complaint.userDto.name + " " +this.complaint.userDto.surname,
        complaintDescription: this.complaint.description,
        statusSelect: this.complaint.userDto.userTypeDto,
      });
    });
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this._album, index);
  }

  setImage(complainGalery: ComplaintGalleries[]) {
    for (let i = 0; i < complainGalery.length; i++) {
      const src = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + complainGalery[i].imageUrl);
      const caption = 'Selam';
      const thumb = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + complainGalery[i].imageUrl);
      const album = {
        src: src,
        caption: caption,
        thumb: thumb
      };

      this._album.push(album);
    }
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

}


