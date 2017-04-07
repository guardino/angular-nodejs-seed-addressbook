import { Component, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MaterialService } from '../../materials.service';
import { MaterialsEventService } from '../../materials.event.service';

@Component({
    selector: 'my-search-box',
    template:`
        <button type="button" (click)="onClick()">Click</button>
        <input 
            #search
            id="search"
            class="form-control"
            type="text" 
            (focus)="onFocus()"
            (blur)="onBlur()"
            [(ngModel)]="targetSearch"
            placeholder="Search...">

            <my-search-box-dropdown 
                    class="list-group list-overflow-control"
                    [target]="targetSearch"
            ></my-search-box-dropdown>
    `
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