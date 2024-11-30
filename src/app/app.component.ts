import { Component } from '@angular/core';
import { UploadComponent } from './upload/upload.component';
import { CommonModule } from '@angular/common';
import { OrganisationComponent } from './organisation/organisation.component';

@Component({
  selector: 'app-root',
  imports: [UploadComponent,CommonModule,OrganisationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'excel-upload';
}
