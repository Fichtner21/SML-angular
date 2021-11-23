import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import '@angular/common/locales/global/pl';

@Pipe({
  name: 'dateFormatPipe'
})
export class DateFormatPipePipe implements PipeTransform {

  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }
  transform(value: string){
    const datePipe = new DatePipe("pl-PL");
    value = datePipe.transform(value, 'dd.MM.yyyy HH:mm');
    return value;
  }
}
