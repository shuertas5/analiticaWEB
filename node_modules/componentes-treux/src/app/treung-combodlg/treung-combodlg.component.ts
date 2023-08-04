import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { TreungTextoComponent } from '../treung-texto/treung-texto.component';
declare const parseBoolean: any;

@Component({
    selector: 'treung-combodlg',
    templateUrl: './treung-combodlg.component.html',
    styleUrls: ['./treung-combodlg.component.scss']
})

export class TreungCombodlgComponent implements OnInit {

    @ViewChild('obj', { static: false }) input: ElementRef; // remove { static: false } if you're using Angular < 8 

    maxlength = 0;
    size = 0;
    formato = "";
    value = "";
    @Input() disabled = false;
    style = "";
    respuesta = "";
    style_respuesta = "";
    @Input() editable = false;
    //pendiente = false;
    //pendiente_valor = "";
    //id = "";
    noedit = false;
    @Input() cursor = "";

    @Output()
    datachange: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    dropdown: EventEmitter<string> = new EventEmitter<string>();

    constructor(private elementRef: ElementRef) {
        this.maxlength = this.elementRef.nativeElement.getAttribute('maxlength');
        this.formato = this.elementRef.nativeElement.getAttribute('formato');
        this.disabled = parseBoolean(this.elementRef.nativeElement.getAttribute('disabled'));
        this.editable = parseBoolean(this.elementRef.nativeElement.getAttribute('editable'));
        this.size = this.elementRef.nativeElement.getAttribute('size');
        this.value = this.elementRef.nativeElement.getAttribute('value');
        this.style = this.elementRef.nativeElement.getAttribute('style');
    }

    ngOnInit(): void {

        if (this.disabled == undefined || this.disabled == null) {
            this.disabled = false;
        }

        if (this.editable == undefined || this.editable == null) {
            this.editable = false;
            this.noedit = true;
        }
 
        if (this.formato == undefined) {
            this.formato = "";
        }

        if (this.size == undefined) {
            this.size = 15;
        }

        if (this.maxlength == undefined) {
            this.maxlength = this.size;
        }

    }

    ondropdown() {
        if (this.disabled == false) {
            this.dropdown.emit("dropdown");
        }
        else if (this.noedit == false) {
            this.dropdown.emit("dropdown");
        }
    }

    cambiodata() {
        this.datachange.emit("datachange");
    }

    ngAfterViewInit() {

        this.cursor = "cursor: pointer;"
        if (this.disabled == true) {
            this.cursor = "cursor: default;"
            if (this.editable == true) {
                this.cursor = "cursor: pointer;"
            }

        }

    }

    setvalue(valuex: string) {
        //this.input.nativeElement.value = valuex;
    }

    getvalue() {
        if (this.input.nativeElement == null) {
            return "";
        }
        return this.input.nativeElement.value;
    }

    focus() {
        this.input.nativeElement.focus();
    }

}
