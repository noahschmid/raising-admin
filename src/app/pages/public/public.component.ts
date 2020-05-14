import { Component, OnInit } from '@angular/core';
import { PublicInformationService } from 'src/app/services/public-information-service/public-information.service';
import { EndpointService } from 'src/app/services/endpoint-service/endpoint.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
  providers:[MessageService]
})
export class PublicComponent implements OnInit {

  constructor(private publicInformationService : PublicInformationService,
    private endpointService: EndpointService,
    private messageService: MessageService) {

   }

  icons:any[];
  selected = -1;
  fileToUpload: File = null;

  ngOnInit(): void {
    this.publicInformationService.getIcons().subscribe(data => {
      this.icons = data;
    });
  }

  selectItem(id) {
    if(id != this.selected)
      this.selected = id;
    else
      this.selected = -1;
  }

  handleFileInput(files: FileList) {
      this.publicInformationService.patchIcon(this.selectItem, files.item(0)).subscribe(data => {
        this.messageService.add({severity:'success', summary:"Icon successfully updated"});
        this.selected = -1;
        this.publicInformationService.getIcons().subscribe(data => {
          this.icons = data;
        });
      }, 
      err => {
        this.selected = -1;
        console.log(err);
        this.messageService.add({severity:'error', summary:"Icon update failed"});
      });
  }

}
