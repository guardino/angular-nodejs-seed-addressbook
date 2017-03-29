import { Component, Input, OnChanges } from '@angular/core';

import { MaterialsEventService } from '../../materials.event.service';

@Component({
    selector: 'my-search-box-dropdown-item',
    template: `
        <a class="my-search-group" *ngFor="let one of item" (click)="onClick(item)">
            <div *ngFor="let t of targetList" class="input-group my-search-list">
                <div 
                    class="input-group-addon my-search-list-item" 
                    style="flex:5"
                    *ngIf="one.value && one.value.toUpperCase().indexOf(t.toUpperCase())>-1 && t!='' && one.key.toUpperCase()!='ID'"> {{one.key}}</div>
                <div 
                    class="form-control my-search-list-item" 
                    style="flex:7"
                    *ngIf="one.value && one.value.toUpperCase().indexOf(t.toUpperCase())>-1 && t!='' && one.key.toUpperCase()!='ID'"> {{one.value}}</div>
            </div>
        </a>
        `
})

export class SearchBoxDropdownItemComponent implements OnChanges {
    @Input() item;
    // reminder: target is the text typed in the searchBox
    @Input() target : string;

    data = [];
    targetList = [];

    constructor(
        private _materialEventService: MaterialsEventService
    ){}

    ngOnChanges() {
        this.targetList = this.target.trim().split(" ");
    }

    onClick(data) : void {
        this._materialEventService.updateData(data);
    }

}