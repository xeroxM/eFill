import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-carprofile',
  templateUrl: './carprofile.page.html',
  styleUrls: ['./carprofile.page.scss'],
})
export class CarprofilePage {
    public connectorForm: FormGroup;

    public connectorTypeObject: Validators = {
        connector_type_object: ''
    };
  constructor(public fb: FormBuilder) { this.createConnectorType(); }

    public createConnectorType() {
        this.connectorForm = this.fb.group({
            connector_type: this.fb.array([])
        });
    }

    get connectorTypeArray() {
        return this.connectorForm.get('connector_type') as FormArray;
    }

    public addConnectorType() {
        const newInstance = this.fb.group({...this.connectorTypeObject});
        this.connectorTypeArray.push(newInstance);
    }

    public removeConnectorType (index) {
        this.connectorTypeArray.removeAt(index);
    }

}
