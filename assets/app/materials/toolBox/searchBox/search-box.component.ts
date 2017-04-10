import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MaterialService } from '../../materials.service';
import { MaterialsEventService } from '../../materials.event.service';

@Component({
    selector: 'my-search-box',
    template:`
        <div style="display: flex;">
            <div style="flex-grow:1;">
                <input 
                    #search
                    id="search"
                    class="form-control"
                    type="text" 
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    [(ngModel)]="targetSearch"
                    placeholder="Search...">
            </div>
            <label class="switch" style="flex-grow:0; margin-top:3px; margin-left:2px;">
                <input type="checkbox" checked>
                <div class="slider round" (click)="onClick()"></div>
            </label>
        </div>
        <my-search-box-dropdown 
                class="list-group list-overflow-control"
                [target]="targetSearch"
        ></my-search-box-dropdown>
    `,
    styles: [`
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .switch input { display:none; }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    `]
})

export class SearchBoxComponent implements OnInit, AfterViewInit {

    @ViewChild('search') search: ElementRef;
    @Output() useless = new EventEmitter();

    targetSearch: String = "";
    
    constructor(
        private _materialService: MaterialService,
        private _materialsEventService: MaterialsEventService
    ){ }

    ngOnInit(){
        this._materialService.data
                        .subscribe(() => this._materialsEventService.clearSearchData());
        
        // get data through keyup event.
        let keyups = Observable.fromEvent(this.search.nativeElement, "keyup")
                                .map(e => {
                                    let eventObj: MSInputMethodContext = <MSInputMethodContext> e
                                    let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
                                    this.targetSearch = target.value;
                                    return this.targetSearch;
                                });

        keyups.debounceTime(300)
                .distinctUntilChanged()
                .subscribe(searchTerm => {
                    this._materialService.getDataByName(searchTerm);
                });
    }

    ngAfterViewInit() {
        this.search.nativeElement.focus();
    }

    onFocus() : void {
        this._materialService.getDataByName(this.targetSearch);
    }

    onClick() : void {
        this._materialsEventService.displayOtherDropdownItems.next(!this._materialsEventService.displayOtherDropdownItems.getValue())
    }

    onBlur() : void {
        // if(this.targetSearch == "") {
        //     this.useless.emit({clicked: true});
        // }
    }

}