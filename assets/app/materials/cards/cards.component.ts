import {Component, Input, ViewChild, OnInit, state, trigger, style, transition, animate} from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { BehaviorSubject } from 'rxjs';

import { ModalComponent } from '../../common/modal.component';
import { JsonObjectPipe } from '../../common/json-object.pipe';
import { MaterialsEventService } from '../materials.event.service';
import { MaterialService } from '../materials.service';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../model/User';

@Component({
    selector: 'my-cards',
    templateUrl: './cards.component.html',
    providers: [DragulaService],
    animations: [
        trigger('addData', [
            state('inactive', style({
                opacity: '0'
            })),
            state('active', style({
                opacity: '1'
            })),
            transition('inactive => active', animate(1200))
        ])
    ]
})

export class CardsComponent implements OnInit{
    @Input() data;
    editObj = [{}];
    deleteObj = [{}];

    @ViewChild('cmodal') cmodal : ModalComponent;
    @ViewChild('dmodal') dmodal : ModalComponent;

    newData : Array<Object> = [];
    state : string = 'inactive';

    checked = false;
    briefing = "You will delete this card from your library.";
    checkbox = "Delete from database. (Careful)";

    user :BehaviorSubject<User>;

    constructor(
        private _dragulaService: DragulaService,
        private _materialService: MaterialService,
        private _materialsEventService: MaterialsEventService,
        private _authService : AuthService
    ) { }

    ngOnInit() {
        this.user = this._authService.user;
        this._dragulaService.dropModel.subscribe(value => { });
        this._materialsEventService.data.subscribe(data => {
            this.newData = data;
            this.onNewDataArrive(this.newData);
        });
    }

    onNewDataArrive(data) : void {
        // TODO : animation for new card not working
        if(data.length > 0) {
            this.state = 'active';
        }
    }
    
    deleteConfirmation(e) {
        this.deleteObj = e.data;
        this.cmodal.showConfirmationModal();
    }
    
    onEdit(e) {
        this.editObj = e.data;
        this.dmodal.showConfirmationModal();
    }

    onDelete() {
        let data = new JsonObjectPipe().transform(this.deleteObj);
        if(this.checked == true) {
            this._materialService.deleteMaterial(data.id);
        }
        this._materialService.deleteData(data);
        this.cmodal.hideConfirmationModal();
    }

    onCheck(){
        this.checked = !this.checked;
    }

    onSave(e){
        this._materialService.updateMaterial(e.data);
        this.dmodal.hideConfirmationModal();
    }

    onCancel() : void {
        this.newData = [];
    }

    addClick() : void {
        this._materialService.addData(new JsonObjectPipe().transform(this.newData));
        // this._materialsEventService.updateSidebarIndex("");
        this.newData = [];
    }
}
