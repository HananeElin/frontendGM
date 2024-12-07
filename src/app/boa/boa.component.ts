import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UploadService } from '../upload.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-boa',
  templateUrl: './boa.component.html',
  styleUrls: ['./boa.component.css'],
})
export class BOAComponent {
  selectedFile: File | null = null;
  isUploading = false;
  errorMessage: string | null = null;
  isDownloading = false;
  filePreview: string[][] | undefined;
  nonValidRows: string[][] | undefined;


   constructor(private uploadService: UploadService) {}


  isLoading = false;
  successMessage: string | null = null;


  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.name.endsWith('.txt')) {
        this.errorMessage = 'Veuillez sélectionner un fichier .txt uniquement.';
        return;
      }



      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileContent = e.target.result as string;
        const rows = fileContent.split('\n').map((line) => line.split('|;'));
        this.filePreview = rows;
        this.identifyNonValidRows(rows);
      };
      reader.readAsText(file);
    }
  }

  identifyNonValidRows(rows: string[][]): void {
    this.nonValidRows = rows.filter((row) => row.length < 5);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner un fichier avant de soumettre.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.uploadService.uploadTXTFile(this.selectedFile).subscribe({
      next: (response) => this.downloadFile(response),
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

   // downloading the sheet from backend
   downloadFile(response: ArrayBuffer): void {
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'processed_file.xlsx');
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  }


}
