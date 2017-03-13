import { Component, Input, Output,EventEmitter, OnInit } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { MaterialService } from '../../materials.service'

@Component({
    selector: 'my-drag-list',
    template: `
            <div style="display: flex; 
                 justify-content: space-between;">
                <ul [dragula]='"list-bag"' 
                    [dragulaModel]='waitingBag' 
                    class="list-group" 
                    style="min-width: 100px; padding-right: 10px;">
                    <li 
                        *ngFor="let item of waitingBag" 
                        class="list-group-item" 
                        [innerHtml]="item.key|uppercase"></li>
                </ul>
                <ul [dragula]='"list-bag"' 
                    [dragulaModel]='selectedBag' 
                    class="list-group" 
                    style="min-width: 100px; padding-left: 10px;">
                    <li 
                        *ngFor="let item of selectedBag" 
                        class="list-group-item" 
                        [innerHtml]="item.key|uppercase"></li>
                </ul>
            </div>       
            <br>
            <button type="button" class="btn btn-primary pull-right" (click)="confirm()">{{ button }}</button>
    `,
    providers: [DragulaService]
})
export class DragListComponent implements OnInit {

    @Output() onConfirm = new EventEmitter();
    @Input() button = "Click me";

    dataView = [];
    waitingBag = [];
    selectedBag = [];

    constructor( 
        private _materialService: MaterialService,
        private _dragulaService: DragulaService
    ) {
        _dragulaService.dropModel.subscribe(() => {
            this.onDropModel();
        });
    }

    ngOnInit() {
        let dataView = []
        this._materialService.dataView.subscribe(res => {
            // TODO : weird error, output not same as input array.
            dataView = res;
                console.log(dataView)
            for(let i=0; i<dataView.length; i++) {
                if(dataView[i].key == "id"){
                    dataView.splice(i,1); // remove id option
                } else {
                    if(dataView[i].value == true) {
                        this.selectedBag.push(dataView[i]);
                    } else {
                        this.waitingBag.push(dataView[i]);
                    }
                }
            }
        });
    }

    confirm() : void {
        for(var i=0; i<this.waitingBag.length; i++) {
            this.waitingBag[i].value = false;
            this.dataView.push(this.waitingBag[i]);
        }
        for(var i=0; i<this.selectedBag.length; i++) {
            this.selectedBag[i].value = true;
            this.dataView.push(this.selectedBag[i]);
        }
        this._materialService.dataView.next(this.dataView);
        this.onConfirm.emit({clicked: true});
    }

    private onDropModel() {
        console.log(this.waitingBag);
        console.log(this.selectedBag);
    }

}