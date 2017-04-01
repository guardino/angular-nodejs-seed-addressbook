/**
 * Created by shijian on 09/03/2017.
 */
import { Component, OnInit, OnDestroy, trigger, state, style, transition, animate } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { User } from '../../model/User';
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
                'min-width': '620px',
                color: 'aliceblue'
            })),
            transition('void => active', [style({opacity: '0', transform:'translateX(-50%)'}),animate(200)]),
            transition('void => openPanel', [style({opacity: '0', transform:'translateX(-50%)', 'width': '0'}),animate(200)])
        ])
    ]
})

export class ToolBoxComponent implements OnInit {

    index: BehaviorSubject<String>;
    user: BehaviorSubject<User>;

    constructor(
        private _materialEventService : MaterialsEventService,
        private _authService : AuthService
    ) { }

    ngOnInit() {
        this.index = this._materialEventService.sidebarIndex;
        this.user = this._authService.user;
    }

    onClick(option: String) : void {
        this._materialEventService.clearSearchData();
        if(this.index.getValue() == option) {
            this.index.next('');
        } else {
            this.index.next(option);
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
            this.index.next('');
    }

}