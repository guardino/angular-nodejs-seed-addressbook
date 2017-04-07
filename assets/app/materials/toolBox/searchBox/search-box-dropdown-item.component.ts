import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { MaterialsEventService } from '../../materials.event.service';
import { MaterialService } from '../../materials.service';

@Component({
    selector: 'my-search-box-dropdown-item',
    template: `
        <a class="my-search-group" *ngFor="let one of item" (click)="onClick(item)">
            <div *ngFor="let t of targetList" class="input-group my-search-list">
                <div 
                    class="input-group-addon my-search-list-item" 
                    style="flex:5"
                    [class.majorData]="one.key == majorData.key"
                    *ngIf="
                        one.key == majorData.key
                        || one.value 
                        && (displayOtherDropdownItems | async)
                        && one.value.toUpperCase().indexOf(t.toUpperCase())>-1 
                        && t!='' 
                        && one.key.toUpperCase()!='ID'"> {{one.key}}</div>
                <div 
                    class="form-control my-search-list-item" 
                    style="flex:7"
                    [class.majorData]="one.key == majorData.key"
                    *ngIf="
                        one.key == majorData.key
                        || one.value 
                        && (displayOtherDropdownItems | async)
                        && one.value.toUpperCase().indexOf(t.toUpperCase())>-1 
                        && t!='' 
                        && one.key.toUpperCase()!='ID'"> {{one.value}}</div>
            </div>
        </a>
        `,
        styles: [`
            .majorData {
                font-weight: 900
            }
        `]
})

export class SearchBoxDropdownItemComponent implements OnChanges, OnInit {
    @Input() item;
    // reminder: target is the text typed in the searchBox
    @Input() target : string;

    data = [];
    majorData = {};
    targetList = [];
    displayOtherDropdownItems;

    constructor(
        private _materialEventService: MaterialsEventService,
        private _materialService : MaterialService
    ){}

    ngOnInit() {
        this.displayOtherDropdownItems = this._materialEventService.displayOtherDropdownItems;
    }

    ngOnChanges() {
        this.targetList = this.target.trim().split(" ");
        this.getMajorData();
    }

    onClick(data) : void {
        this._materialEventService.updateData(data);
    }

    getMajorData() {
        let dataview = this._materialService.dataView.getValue();
        if((<any>dataview[0]).key) {
            this.majorData = dataview[1];
        } else {
            this.majorData = dataview[0];
        }
    }

}