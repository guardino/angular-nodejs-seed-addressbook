/**
 * Created by shijian on 09/03/2017.
 */
import { Component, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../auth/auth.service';
import { MaterialsEventService } from '../materials.event.service';

@Component({
    selector: 'my-tool-box',
    templateUrl: './tool-box.component.html',
    styles: [`
        .tool-box {
            border-bottom-right-radius: 20px;
            border-top-right-radius: 20px;
            width: 8%;
        }
    `],
    animations: [
        trigger('animatePanel', [
            state('active', style({
                opacity: '1',
                transform: 'translateX(0)',
            })),
            state('openPanel', style({
                opacity: '1',
                transform: 'translateX(0)',
                padding: '20px',
                'flex-grow': '1',
                'min-width': '440px',
                color: 'aliceblue'
            })),
            transition('void => active', [style({opacity: '0', transform:'translateX(-50%)'}),animate(200)]),
            transition('void => openPanel', [style({opacity: '0', transform:'translateX(-50%)', 'width': '0'}),animate(200)])
        ])
    ]
})

export class ToolBoxComponent implements OnInit, OnDestroy {

    index: String;
    scope = [];

    constructor(
        private _materialEventService : MaterialsEventService,
        private _authService : AuthService
    ) { }

    ngOnInit() {
        this._materialEventService.sidebarIndex
            .subscribe(index => {
                this.index = index;
            });
        this._authService.scope
            .subscribe(scope => {
                this.scope = scope;
            });
    }

    ngOnDestroy() {
        this._authService.scope.unsubscribe();
        this._materialEventService.sidebarIndex.unsubscribe();
    }

    onClick(option) : void {
        if(this.index == 'search') {
            // TODO: since the onBlur() method triggered first.
        } else if(this.index == option) {
            this.index = '';
        } else {
            this.index = option;
        }
    }

    onSearch() : void {

    }

    onUpload() : void {

    }

    onAdding() : void {

    }

    onConfig() : void {

    }

    // close the search sidebar
    onUseless(e) : void {
        if(e.clicked == true)
            this.index = '';
    }

}