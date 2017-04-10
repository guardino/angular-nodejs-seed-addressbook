import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../auth/auth.service';
import { MaterialsEventService } from './materials.event.service';
import { Observable } from 'rxjs';
import 'rxjs';

@Injectable()
export class MaterialService{

    private baseUrl = process.env.baseUrl;
    private appUrl = process.env.appUrl;

    constructor(
        private _http: Http, 
        private _authService: AuthService,
        private _materialsEventService: MaterialsEventService
    ){
        this.getColumns();
    }

    private _data = [];

    data = new BehaviorSubject<Array<Object>>(this._data);
    columns = new BehaviorSubject<Array<Object>>([]);
    dataView = new BehaviorSubject<Array<Object>>([]);

    getAllData() {
        return this._authService.getToken().flatMap(token => {
            let params = this.composeQuery({access_token : token});
            return this._http.get(this.baseUrl, { search: params })
                    .map(res => res.json());
        })
    }


    getDataByName(name){
        this._materialsEventService.clearSearchData();
        this._authService.getToken().flatMap(token => {
            let params = this.composeQuery({access_token : token, query: name});
            return this._http.get(this.baseUrl + '/material', { search: params })
                        .map(res => res.json())
        })
        .distinctUntilChanged()
        .subscribe(data => {
            if(name == "" || name === null || typeof name === 'undefined') {
                this._materialsEventService.search.next([]);
            } else {
                this._materialsEventService.search.next(data);
            }
        });
    }

    getColumns() {
        this._authService.getToken().flatMap(token => {
            let params = this.composeQuery({access_token : token});
            return this._http.get(this.baseUrl + '/columns', { search: params })
                    .map(res => res.json())
        })
        .distinctUntilChanged()
        .subscribe(data => {
            this.getDataView();
            this.columns.next(data);
            this.columns.complete();
        });
    }

    appendCsv(file): void {
        let formData:FormData = new FormData();
        formData.append('file', file, file.name);
        this._authService.getToken().flatMap(token => {
            let params = this.composeQuery({access_token : token});
            return this._http.post(this.baseUrl + "/appendcsv", formData, { search: params })
        })
        .subscribe(data => console.log(data));
        // update columns and data view.
        this.getColumns();
        this.getDataView();
    }

    importCsv(file): void {
        let formData:FormData = new FormData();
        formData.append('file', file, file.name);
        this._authService.getToken().flatMap(token => {
            let params = this.composeQuery({access_token : token});
            return this._http.post(this.baseUrl + "/importcsv", formData, { search: params })
        })
        .subscribe(data => console.log(data));
        // update columns and data view.
        this.getColumns();
        this.getDataView();
    }

    getDataView() {
        this._authService.user.subscribe(user => {
            let _dataView = [];
            let params = this.composeQuery({username : user.user_name});
            if(user.scope.indexOf('uaa.admin') > -1) {
                Observable.forkJoin([
                    this._http.get(this.appUrl + "/dataView/defaultview").map(res => res.json().dataview),
                    this._http.get(this.appUrl + "/dataView/userview", { search: params }).map(res => res.json().dataview)
                ]).subscribe(data => {
                    let defaultview = data[0];
                    let userview = data[1];
                    let columns = this.columns.getValue();
                    // use defaultview if userview is not been defined.
                    userview = userview.length == 0? defaultview : userview;
                    for(let i=0; i<userview.length; i++) {
                                    let exists: boolean = false;
                                    for(let j=0; j<columns.length; j++) {
                                        if(userview[i].trim().toLowerCase() == columns[j].toString().trim().toLowerCase()) {
                                            exists = true;
                                        }
                                    }
                                    if(exists) {
                                        _dataView.push({key: userview[i] , value: exists});
                                    }
                                }
                                for(let i=0; i<columns.length; i++) {
                                    let exists: boolean = false;
                                    for(let j=0; j<_dataView.length; j++) {
                                        if(_dataView[j].key.trim().toLowerCase() == columns[i].toString().trim().toLowerCase()) {
                                            exists = true;
                                        }
                                    }
                                    if(!exists)
                                        _dataView.push({key: columns[i] , value: exists});
                                }
                                this.dataView.next(_dataView);
                })
            } 
            if(user.scope.indexOf('uaa.admin') == -1 && user.scope.indexOf('uaa.user') > -1){
                Observable.forkJoin([
                    this._http.get(this.appUrl + "/dataView/defaultview").map(res => res.json().dataview),
                    this._http.get(this.appUrl + "/dataView/userview", { search: params }).map(res => res.json().dataview)
                ]).subscribe(data => {
                    let columns = data[0];
                    let userview = data[1];
                    // select allowed data view
                    for(let i=0; i<userview.length; i++) {
                        let exists: boolean = false;
                        for(let j=0; j<columns.length; j++) {
                            if(userview[i].trim().toLowerCase() == columns[j].toString().trim().toLowerCase()) {
                                exists = true;
                            }
                        }
                        if(exists) {
                            _dataView.push({key: userview[i] , value: exists});
                        }
                    }
                    for(let i=0; i<columns.length; i++) {
                        let exists: boolean = false;
                        for(let j=0; j<_dataView.length; j++) {
                            if(_dataView[j].key.trim().toLowerCase() == columns[i].toString().trim().toLowerCase()) {
                                exists = true;
                            }
                        }
                        if(!exists)
                            _dataView.push({key: columns[i] , value: exists});
                    }
                    // reverse logic, every selected item will be displayed by default.
                    if(userview.length == 0) {
                        for(let i=0; i<_dataView.length; i++) {
                            _dataView[i].value = !_dataView[i].value;
                        }
                    }
                    this.dataView.next(_dataView);
                })
            }
        })
    }

    updateDataView(newDataview : Array<any>) {
        this.dataView.next(newDataview);
        this._authService.user.subscribe(user => {
            console.log(user.scope)
            let params = this.composeQuery({username : user.user_name});
            let choosenArray = [];
            for(var i=0; i<newDataview.length; i++) {
                if(newDataview[i].value == true)
                    choosenArray.push(newDataview[i].key)
            }
            console.log(choosenArray);
            // TODO
            this._http.post(this.appUrl + "/dataview/userview", choosenArray, { search: params })
                        .toPromise()
                        .then(data => console.log(data), err=> console.log(err));
            if(user.scope.indexOf('uaa.admin') > -1) {
                this._http.post(this.appUrl + "/dataview/defaultview", choosenArray, { search: params })
                            .toPromise()
                            .then(data => console.log(data), err=> console.log(err));
            }
        })
    }

    createMaterial(material){
        let body = JSON.stringify(material);
        if(typeof body != 'undefined') {
            this._authService.getToken().flatMap(token => {
                let params = this.composeQuery({access_token : token});
                return this._http.post(this.baseUrl + "/material", body, { search: params })
                                .map(res =>  res.json())
            })
            .subscribe(data => {
                this.addData(data);
            });
        }
    }

    updateMaterial(material) {
        let body = JSON.stringify(material);
        if(typeof body != 'undefined') {
            this._authService.getToken().flatMap(token => {
                let params = this.composeQuery({access_token : token});
                return this._http.put(this.baseUrl + "/material", body, { search: params })
                                .map(res => res.json())
            })
            .subscribe(data => {
                this.updateData(data);
            });
        }
    }

    deleteMaterial(id) {
        this._authService.getToken().flatMap(token => {
            let params = this.composeQuery({access_token : token});
            return this._http.delete(this.baseUrl + "/material/" + id, { search: params })
        })
        .subscribe(confirmation =>
            console.log(confirmation)
        );
    }

    addData(obj) {
        if(!this.checkDataExists(obj.id)) {
            this._data.push(obj);
            this.data.next(this._data);
        } else {
            console.log('Data exists, can not add.');
        }
    }

    deleteData(obj) {
        if(this.checkDataExists(obj.id)) {
            let i = this.findDataIndex(obj.id);
            this._data.splice(i,1);
        }
        this.data.next(this._data);
    }

    private composeQuery(json) {
        let params: URLSearchParams = new URLSearchParams();
        for (let key in json) {
            params.set(key, json[key]);
        }
        return params;
    }

    private updateData(obj) {
        if(this.checkDataExists(obj.id)) {
            this._data.splice(this.findDataIndex(obj.id), 1);
            this._data.push(obj);
            this.data.next(this._data);
        }
    }

    private checkDataExists(id) {
        for(let i=0; i<this._data.length; i++){
            if(id == this._data[i].id){
                return true;
            }
        }
        return false;
    }

    private findDataIndex(id) {
        for(let i=0; i<this._data.length; i++){
            if(id == this._data[i].id){
                return i;
            }
        }
    }

    // convert Json to CSV data in Angular2, removes 'id' field
    JsonToCSV(json) {
        let array = typeof json != 'object' ? JSON.parse(json) : json;
        let str : string = '';
        let row : string = '';

        for (let index in json[0]) {
            if(index != 'id') {
                //Now convert each value to string and comma-separated
                row += index + ',';
            }
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if(index != 'id') {
                    if (line != '') { line += ','; } 
                    line += array[i][index];
                }
            }
            str += line + '\r\n';
        }
        return str;
    }
}
