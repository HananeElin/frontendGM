import { Component } from '@angular/core';
import { UploadComponent } from './upload/upload.component';
import { CommonModule } from '@angular/common';
import { BOAComponent } from './boa/boa.component';

@Component({
  selector: 'app-root',
  imports: [
    UploadComponent,
    CommonModule,
    BOAComponent,
    CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'excel-upload';
}
