import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({
  name: 'sortByOrder'
})
export class SortByOrderPipe implements PipeTransform {

  transform(value: any[]): any {   
    if(value){
      return value.sort((n1, n2) => {
        return n2.wars - n1.wars;
      });
    }    
  }
}
