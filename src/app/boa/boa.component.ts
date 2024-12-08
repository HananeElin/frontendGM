import { Component } from '@angular/core';
import { UploadService } from '../upload.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-boa',
  templateUrl: './boa.component.html',
  styleUrls: ['./boa.component.css'],
})
export class BOAComponent {
  fileBefore: any;
  selectedFile!: File;
  errorMessage: string = '';
  downloading: boolean = false;

  data: any[] = [];

  constructor(private uploadService: UploadService) {}

  // Handle file selection and process it based on the type
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      if (file.name.endsWith('.txt')) {
        this.processTxtData(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.processExcelData(e.target.result);
      }
    };
    reader.readAsText(file);
  }

  // Process the .txt file data
  processTxtData(text: string): void {
    const lines = text.split('\n');
    this.data = lines.map(line => line.split('\t')); // Assuming tab-separated, adjust if necessary
  }

  // Process the Excel file data
  processExcelData(data: ArrayBuffer): void {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    this.fileBefore = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  }

  // Export processed data to Excel
  exportToExcel(): void {
    const worksheet = XLSX.utils.aoa_to_sheet(this.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'txt-to-excel');
  }

  // Save the file as an Excel file using native API
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;  // Set the file name for download
    document.body.appendChild(link);
    link.click();  // Trigger the download
    document.body.removeChild(link);  // Remove the link element from the DOM
    window.URL.revokeObjectURL(url);  // Clean up the object URL
  }

  // Upload the file
  onUpload(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        if (this.selectedFile.name.endsWith('.txt')) {
          const rows = content.split('\n').map((row: string) => row.split('\t'));
          const ws = XLSX.utils.aoa_to_sheet(rows);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, 'converted-file.xlsx');
        }
      };
      reader.readAsText(this.selectedFile);
    }
  }



  // Download the processed file from the backend
  downloadProcessedFile(): void {
    if (this.selectedFile) {
      this.uploadService.downloadTXT(this.selectedFile).subscribe((response: Blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        link.href = url;
        link.setAttribute('download', 'processed_file.zip');
        document.body.appendChild(link);
        link.click();
      }, (error) => {
        this.errorMessage = 'Failed to download processed file';
      });
    }
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
