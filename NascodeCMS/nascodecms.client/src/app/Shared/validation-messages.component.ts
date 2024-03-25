import { Component, Input, OnChanges } from '@angular/core';
import { NgForm, NgModelGroup } from '@angular/forms';
import * as _ from 'lodash';

class ErrorDef {
    error!: string;
    errorText!: string;
    errorProperty!: string;
}

@Component({
    selector: '<validation-messages>',
    template: ''
    // template: `<div class="has-danger" *ngIf="formCtrl.invalid && (formCtrl.dirty || formCtrl.touched)">
    //                 <div *ngFor="let errorDef of errorDefsInternal">
    //                     <div *ngIf="getErrorDefinitionIsInValid(errorDef)" class="form-control-feedback">
    //                         {{getErrorDefinitionMessage(errorDef)}}
    //                     </div>
    //                 </div>
    //            </div>`
})
export class ValidationMessagesComponent {

    _errorDefs: ErrorDef[] = [];

    @Input() formCtrl: any;
    @Input() set errorDefs(value: ErrorDef[]) {
        this._errorDefs = value;
    }

    readonly standartErrorDefs: ErrorDef[] = [
        { error: 'required', errorText: 'ThisFieldIsRequired' } as ErrorDef,
        { error: 'minlength', errorText: 'PleaseEnterAtLeastNCharacter', errorProperty: 'requiredLength' } as ErrorDef,
        { error: 'maxlength', errorText: 'PleaseEnterNoMoreThanNCharacter', errorProperty: 'requiredLength' } as ErrorDef,
        { error: 'email', errorText: 'InvalidEmailAddress' } as ErrorDef,
        { error: 'pattern', errorText: 'InvalidPattern', errorProperty: 'requiredPattern' } as ErrorDef
    ];

    get errorDefsInternal(): ErrorDef[] {
        let standarts = _.filter(this.standartErrorDefs, (ed) => !_.find(this._errorDefs, (edC) => edC.error === ed.error));
        let all = <ErrorDef[]>_.concat(standarts, this._errorDefs);

        return all;
    }

    constructor(
    ) { }

    getErrorDefinitionIsInValid(errorDef: ErrorDef): boolean {
        return !!this.formCtrl.errors[errorDef.error];
    }

    getErrorDefinitionMessage(errorDef: ErrorDef): string {
        let errorRequirement = this.formCtrl.errors[errorDef.error][errorDef.errorProperty];
        return !!errorRequirement
            ? errorDef.errorText
            : errorDef.errorText;
    }


    public findWhiteSpace(createForm: NgForm) {
        const controls = createForm.controls;
        var reWhiteSpace = /^\s+$/; 
        if (createForm.valid) {
            for (const i in controls) {
                var valueName = controls[i].value;
                // console.log(controls[i].parent);
                if (valueName !== undefined || valueName !== null || valueName !== '') {
                    if (reWhiteSpace.test(valueName)) { 
                        // if (controls[i].valid) {
                            if (valueName.toString().trim() == '') {
                                // alert(i + ' ' + valueName)
                                controls[i].reset();
                            }
                        // }
                    }
                }
            }
        }
        else {

        }
        // console.log(createForm.valid)
        // return reseted;
    }
    public findInvalidControls(createForm: NgForm) {
        var InvalidFileds = '';
        const invalid = [];
        const controls = createForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
                if (InvalidFileds != '') InvalidFileds += " and ";
                InvalidFileds += name;
            }
        }
        return InvalidFileds;
    }

}

