import { Component } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  

@Component({  
  selector: 'app-upload',  
  templateUrl: './upload.component.html',  
  styleUrls: ['./upload.component.scss']  
})  
export class UploadComponent {  
  selectedFiles: FileList;  
  results: any; // Zmienna do przechowywania wyników  

  constructor(private http: HttpClient) {}  

  onFileChange(event: any) {  
    this.selectedFiles = event.target.files;  
  }  

  uploadFiles() {  
    if (this.selectedFiles && this.selectedFiles.length > 0) {  
      const formData = new FormData();  
      for (let i = 0; i < this.selectedFiles.length; i++) {  
        formData.append('screenshots', this.selectedFiles[i]);  
      }  

      this.http.post('http://localhost:5000/upload', formData)  
       .subscribe(response => {  
         console.log('Odpowiedź z serwera: ', response);  
         this.results = response; // Przechowuj wyniki  
       }, error => {  
         console.error('Błąd podczas przesyłania plików: ', error);  
       });  
    }  
  }  
}