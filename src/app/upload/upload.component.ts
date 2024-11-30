import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../upload.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  constructor(@Inject(UploadService) private uploadService: UploadService) {}

  fileBefore: any[][] = []; // Content of the uploaded file
  fileAfter: any[][] = []; // Content of the processed file
  selectedFile!: File;
  fileNonValide: any[][] = []; // Array to hold non-valid rows

  // Drag-and-drop state
  isDragging = false;

  // Handle file selection
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;

    // Parse the file to preview before upload
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      this.fileBefore = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    };
    reader.readAsArrayBuffer(file);
  }

  // Identify non-valid rows
  identifyNonValidRows(data: any[][]): void {
    this.fileNonValide = data.filter((row) => {
      const phoneNumber = row[0]; // Assuming phone number is in the first column
      if (!phoneNumber || phoneNumber === '' || phoneNumber === 'invalid') {
        return true; // Mark as invalid
      }

      if (!this.isValidPhoneNumber(phoneNumber)) {
        return true; // Mark as invalid
      }
      const register = row[1];
      if (!register || register === '' || register === 'invalid') {
        return true; // Mark as invalid
      }

      if (!this.isValidRegister(register)) {
        return true; // Mark as invalid
      }

      const amount = row[2]; // Assuming the amount is in the third column
      if (isNaN(amount) || amount <= 0) {
        return true; // Mark as invalid
      }

      return false; // If none of the conditions are met, the row is valid
    });
  }

  // Helper method to validate phone number
  isValidPhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phoneNumber);
  }




  // Helper method to validate register number
  isValidRegister(register: string): boolean {
    const registerPatern = /^[0-9]{10}$/;
    return registerPatern.test(register);
  }



  // Drag-and-drop logic
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true; // Highlight the drop area when dragging over
  }

  onDragLeave(event: DragEvent): void {
    this.isDragging = false; // Remove highlight when dragging leaves
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false; // Reset drag state

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile = file;

      // Parse the file to preview before upload
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        this.fileBefore = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Identify non-valid rows and store them
        this.identifyNonValidRows(this.fileBefore);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Upload the file to backend
  onUpload(): void {
    if (this.selectedFile) {
      this.uploadService.uploadFile(this.selectedFile).subscribe((response) => {
        // Parse the processed file for preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          this.fileAfter = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // After processing, identify non-valid rows
          this.identifyNonValidRows(this.fileAfter);
        };
        reader.readAsArrayBuffer(new Blob([response]));
      });
    }
  }

  // Download the processed file
  downloadProcessedFile(): void {
    if (this.selectedFile) {
      this.uploadService.uploadFile(this.selectedFile).subscribe((response) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'processed_file.xlsx');
        document.body.appendChild(link);
        link.click();
      });
    }

    // Reset the state after the download
    this.resetTables();
  }

  // Method to reset the state of the component
  resetTables(): void {
    this.fileBefore = [];
    this.fileAfter = [];
    this.selectedFile = null!;
    this.fileNonValide = [];
  }
}
