import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'objs'})
export class JsonObjectPipe implements PipeTransform {
  transform(value) : any {
    let map = new Object();
    if(!value || value.length === 'undefined') {
      return;
    }
    for(let i=0; i<value.length; i++) {
      for (let key in value[i]) {
        map[value[i].key]=value[i].value;
      }
    }
    return map;
  }
}