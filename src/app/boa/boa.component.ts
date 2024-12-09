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

  data: string[][] = []; // Processed data to display or export

  constructor(private uploadService: UploadService) {}

  // Handle file selection and process it based on the type
  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const content = e.target.result;
      if (file.name.endsWith('.txt')) {
        this.processTxtData(content);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        this.processExcelData(e.target.result);
      }
    };
    reader.readAsText(file);
  }

  // Process the .txt file data, keeping the first line as the header
  processTxtData(text: string): void {
    const lines = text.split('\n');

    // The first line is the header, so we store it separately
    const header = lines[0];

    // Process the remaining rows and clean them, passing 'false' for non-header rows
    this.data = lines.slice(1).map(line => this.cleanRow(line.split('|;'), false));

    // Add the header back to the data at the top
    this.data.unshift(header.split('|;')); // Keep header as it is
  }

  // Process the Excel file data
  processExcelData(data: ArrayBuffer): void {
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData: string[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

    // Process all rows, passing 'true' for the first row (header) and 'false' for others
    this.fileBefore = rawData.map((row, index) => this.cleanRow(row, index === 0)); // 'true' for the header row
  }

  // Clean a row by processing columns 1, 2, and 3 and handling separators
  cleanRow(row: string[], isHeader: boolean): string[] {
    return row.map((cell, index) => {
      if (isHeader) {
        return cell; // Keep the header cells unchanged
      }

      // Apply processing to columns 1, 2, and 3 only if it's not the header row
      if (index === 1 || index === 2 || index === 3) {
        return this.validatePhone(cell);
      }

      return cell ? cell.split('|;').join(' ') : 'NA '; // Handle other columns
    });
  }

  // Validate and clean phone numbers
  validatePhone(phone: string): string {
    if (!phone || phone.trim().length === 0) {
      return 'NA (empty)'; // Replace empty or null values with "NA"
    }

    // Remove all non-numeric characters
    phone = phone.replace(/[^0-9]/g, '');

    // Handle prefixes +212, 212, or 00212
    if (phone.startsWith('212')) {
      phone = '0' + phone.substring(3);
    } else if (phone.startsWith('00212')) {
      phone = '0' + phone.substring(5);
    }

    // Validate phone number length
    return phone.length === 10 ? phone : 'NA phone number invalid'; // Return "NA" if invalid
  }

  // Export processed data to Excel
  exportToExcel(): void {
    const worksheet = XLSX.utils.aoa_to_sheet(this.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'processed-data');
  }

  // Save the file as an Excel file using native API
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Upload the file 
  onUpload(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        if (this.selectedFile.name.endsWith('.txt')) {
          const rows = content.split('\n').map((row: string) => this.cleanRow(row.split('|;'), false));
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
  // downloadProcessedFile(): void {
  //   if (this.selectedFile) {
  //     this.uploadService.downloadTXT(this.selectedFile).subscribe(
  //       (response: Blob) => {
  //         const link = document.createElement('a');
  //         const url = window.URL.createObjectURL(response);
  //         link.href = url;
  //         link.setAttribute('download', 'processed_file.zip');
  //         document.body.appendChild(link);
  //         link.click();
  //       },
  //       (error) => {
  //         this.errorMessage = 'Failed to download processed file';
  //       }
  //     );
  //   }
  // }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
