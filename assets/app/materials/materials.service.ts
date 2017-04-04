import { Http, URLSearchParams, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../auth/auth.service';
import { MaterialsEventService } from './materials.event.service';
import 'rxjs';

@Injectable()
export class MaterialService{

    private baseUrl = process.env.baseUrl;

    constructor(
        private _http: Http, 
        private _authService: AuthService,
        private _materialsEventService: MaterialsEventService
    ){
        this.getColumns();
    }

    private _data = [];
    private _columns = [];
    private _dataView = [];

    data = new BehaviorSubject<Array<Object>>(this._data);
    columns = new BehaviorSubject<Array<Object>>(this._columns);
    dataView = new BehaviorSubject<Array<Object>>(this._dataView);

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
            this._columns = data;
            this.updateDataView();
            this.columns.next(this._columns);
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
        this.updateDataView();
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
        this.updateDataView();
    }

    updateDataView() {
        // TODO: grab this from the server backend.
        this.columns.subscribe(res => {
            for(let i=0; i<res.length; i++) {
                let exists: boolean = false;
                for(let j=0; j<this._dataView.length; j++) {
                    if(this._dataView[j].key.trim().toLowerCase() == res[i].toString().trim().toLowerCase()) {
                        exists = true;
                    }
                }
                if(!exists) {
                    this._dataView.push({key: res[i] , value: true});
                }
            }
            this.dataView.next(this._dataView);
        });
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
                this.data.next(this._data);
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
