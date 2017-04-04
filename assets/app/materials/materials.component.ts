import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { MaterialService } from './materials.service';
import { MaterialsEventService } from './materials.event.service';

@Component({
    selector: 'my-materials',
    templateUrl: './materials.component.html',
    providers: [
        MaterialService,
        MaterialsEventService
    ]
})

export class MaterialsComponent implements OnInit {

    data;

    constructor(
        private _materialService: MaterialService,
        private _location : Location
    ) { }

    ngOnInit() {
        // clear the query params after loggin
        this._location.replaceState('/materials');
        this.data = this._materialService.data;
    }
}