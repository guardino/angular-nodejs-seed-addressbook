import { Component, Input, OnInit } from '@angular/core';
import { MaterialsEventService } from '../../materials.event.service';

@Component({
    selector: 'my-search-box-dropdown',
    template: `
        <my-search-box-dropdown-item 
                    style="width: 100%;"
                    *ngFor="let item of data | async" 
                    [item]="item | keys" 
                    [target]="target">
        </my-search-box-dropdown-item>
    `

})

export class SearchBoxDropdownComponent implements OnInit {
    data;
    @Input() target;

    constructor(private _materialEventService: MaterialsEventService){ }

    ngOnInit(){
        this.data = this._materialEventService.search;
    }

}