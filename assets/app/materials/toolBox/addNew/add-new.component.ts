import { Component, Output, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { MaterialService } from '../../materials.service';

@Component({
    selector: 'my-add-new',
    template: `
        <h5>{{ title }}</h5>
        
        <label for="append-file" class="custom-file">
            <div>
                <h6 style="cursor: pointer; border: 1px solid ghostwhite; border-radius: 5px; padding: 10px;">Append CSV</h6>
            </div>
            <input #myAppend class="custom-file-input" id="append-file" type="file" (change)="onFileChange($event)" hidden>
        </label>
        
        <div *ngIf="dataName != ''">
            <br><small>&nbsp;&nbsp;&nbsp;You will upload: &nbsp;&nbsp;&nbsp;</small>{{ dataName }}
            <div class="alert alert-danger" role="alert" *ngIf="!fileIsValid && !uploaded">
                {{ errorMessage }}
            </div>
            <br><br>
            <button *ngIf="fileIsValid" type="button" class="btn btn-primary" (click)="onConfirm()">Confirm</button>
        </div>

        <div class="alert alert-success" role="alert" *ngIf="uploaded">"Uploading finished."</div>

        <my-form-list
                [data]="columns | async | arrayToJson"
                [button]="'Add'"
                (submit)="onAdd($event)"
        ></my-form-list>
    `
})

export class AddNewComponent implements OnInit {

    columns;
    title = "Add New Data";

    dataName = "";
    data;
    errorMessage = "For god's sake! Upload a CSV file please!!!!";
    fileIsValid = false;
    uploaded = false;

    @Output() useless = new EventEmitter();
    @ViewChild('myAppend') fileAppend;

    constructor(private _materialService: MaterialService) { }
    
    ngOnInit() {
        this.columns = this._materialService.columns;
    }

    onFileChange(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        this.data = files[0];
        this.uploaded = false;
        this.dataName = this.data.name;
        this.fileIsValid = this.fileValidation();
    }
    
    onConfirm() : void {
        this._materialService.appendCsv(this.data);
        this.fileAppend.nativeElement.value = "";
        this.dataName = "";
        this.uploaded = true;
    }

    fileValidation() : boolean {
        if(!this.dataName.endsWith(".csv")) {
            return false;
        }
        return true;
    }

    onAdd(e) {
        this.uploaded = false;
        this._materialService.createMaterial(e.data);
        this.useless.emit({clicked: e.submitted});
    }
}