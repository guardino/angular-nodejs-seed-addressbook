import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'arrayToJson'})
export class ArrayJsonPipe implements PipeTransform {
  transform(value) : any {
    let map = new Object();
    if(!value || value.length === 'undefined') {
      return;
    }
    for(let i=0; i<value.length; i++) {
        map[value[i]]="";
    }
    return map;
  }
}