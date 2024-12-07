import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private uploadUrl = 'http://localhost:8089/api/excel/upload'; // Spring Boot backend URL
  private downloadMultipleFilesUrl = 'http://localhost:8089/api/excel/upload/multi-files';
  private BOAUrl='http://localhost:8089/api/files/upload_txt';

  constructor(private http: HttpClient) {}

  // Method to upload the Excel file and receive the processed file as a response
  uploadFile(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    // Send the file to the backend
    return this.http.post<Blob>(this.uploadUrl, formData, {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json'  // We expect a Blob response (processed Excel file)
    });
  }

  // download to an excel file
  private downloadUrl = 'http://localhost:8089/api/excel/upload';
  download(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.downloadUrl, formData, { responseType: 'blob' });
  }

  // download zip content 2 files(valid and invalid excel)
  downloadMultiplefiles(file: File, fields: any): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('telephone', fields.telephone);
    formData.append('telGestionnaire', fields.telGestionnaire);
    formData.append('amount', fields.amount);

    return this.http.post(this.downloadMultipleFilesUrl, formData, { responseType: 'blob' });
  }

    // //  method to download invalid rows in Excel format
    // downloadInvalidRows(nonValidRows: any[]): Observable<Blob> {
    //   const ws = XLSX.utils.aoa_to_sheet(nonValidRows); // Convert rows to Excel sheet
    //   const wb = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(wb, ws, 'Invalid Rows');
    //   const invalidFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    //   const blob = new Blob([invalidFile], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //   const fileUrl = window.URL.createObjectURL(blob);
    //   const fileLink = document.createElement('a');
    //   fileLink.href = fileUrl;
    //   fileLink.download = 'invalid_rows.xlsx'; // Set file name for download
    //   fileLink.click();

    //   return this.http.post<Blob>(this.uploadUrl, ws, {
    //     headers: new HttpHeaders(),
    //     responseType: 'blob' as 'json'  // We expect a Blob response (processed Excel file)
    //   });
    // }
// Méthode pour lire le fichier Excel et renvoyer l'entête (première ligne)
readExcelFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // Récupère le nom de la première feuille
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Récupère les données du fichier en format JSON (en indiquant qu'il faut considérer la première ligne comme l'entête)
      const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Si le fichier contient des données, retourne la première ligne (entête)
      if (rawData.length > 0) {
        resolve(rawData[0]);
      } else {
        reject('Aucune donnée dans le fichier');
      }
    };

    // En cas d'erreur de lecture du fichier
    reader.onerror = (error) => {
      reject(error);
    };

    // Lire le fichier comme chaîne binaire
    reader.readAsBinaryString(file);
  });
}
 // Method to upload the Excel file and receive the processed file as a response
//  uploadFile(file: File): Observable<Blob> {
//   const formData = new FormData();
//   formData.append('file', file, file.name);

//   // Send the file to the backend
//   return this.http.post<Blob>(this.uploadUrl, formData, {
//     headers: new HttpHeaders(),
//     responseType: 'blob' as 'json', // We expect a Blob response (processed Excel file)
//   });
// }
 // Method to upload the .txt file and return the Excel file as binary data
 uploadTXTFile(file: File): Observable<ArrayBuffer> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post<ArrayBuffer>(`${this.BOAUrl}/upload_txt`, formData, {
    headers: new HttpHeaders(),
    responseType: 'arraybuffer' as 'json', // Ensure response is treated as binary data
  });
}
}
