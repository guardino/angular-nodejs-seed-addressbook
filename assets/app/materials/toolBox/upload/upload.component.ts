/**
 * Created by shijian on 10/03/2017.
 */
import { Component, ViewChild } from '@angular/core';

import { MaterialService } from '../../materials.service';
import { ExportService } from './export.service';

import { ModalComponent } from "../../../common/modal.component";

@Component({
    selector: 'my-upload',
    templateUrl: './upload.component.html',
    styles: [`
        .custom-file:hover {
            opacity: 0.5;
        }
    `],
    providers: [ExportService]
})
export class UploadComponent{

    @ViewChild('myImport') fileImport;

    dataName = "";
    data;
    dangerAlert = "Danger! This operation will rewrite the whole database!"
    errorMessage = "For god's sake! Upload a CSV file please!!!!";
    fileIsValid = false;
    uploaded = false;

    constructor(
        private _materialService: MaterialService,
        private _exportService: ExportService
    ) {}

    onFileChange(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        this.data = files[0];
        this.dataName = this.data.name;
        this.fileIsValid = this.fileValidation();
        this.uploaded = false;
    }

    onExport() {
        this._materialService.getAllData()
            .subscribe(data => {
                let csv = this._materialService.JsonToCSV(data);
                this._exportService.downloadCSVFile(csv, "export_file");
            })
    }

    onConfirm() : void {
        this._materialService.importCsv(this.data);
        this._materialService.getColumns();
        this.fileImport.nativeElement.value = "";
        this.dataName = "";
        this.uploaded = true;
    }

    fileValidation() : boolean {
        if(!this.dataName.endsWith(".csv")) {
            return false;
        }
        return true;
    }
}