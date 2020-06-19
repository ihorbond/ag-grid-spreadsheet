import { Component, LOCALE_ID, Inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { formatDate } from '@angular/common';

@Component({
    selector: 'datetime-cell',
    template: `<span>{{ formatTheDate() }}</span>`
})
export class DateTimeRenderer implements ICellRendererAngularComp {

    params: ICellRendererParams; 
    selectedDate: Date;

    constructor(@Inject(LOCALE_ID) public locale: string) { }

    agInit(params: ICellRendererParams): void {
        this.params = params;
        this.selectedDate = params.value;
    }

    formatTheDate() {
        //  Convert our selected Date into a readable format
        if (this.selectedDate == null)
            return "";

        return formatDate(this.selectedDate, 'd MMM yyyy', this.locale);
    }

    public onChange(event) {
        this.params.data[this.params.colDef.field] = event.currentTarget.checked;
    }

    refresh(params: ICellRendererParams): boolean {
        this.selectedDate = params.value;
        return true;
    }
}