import { Component, OnInit, ElementRef, Output, EventEmitter, Input, ViewChild } from '@angular/core';
declare const parseBoolean: any;

@Component({
    selector: 'treung-combodlgnum',
    templateUrl: './treung-combodlgnum.component.html',
    styleUrls: ['./treung-combodlgnum.component.scss']
})
export class TreungCombodlgnumComponent implements OnInit {

    @ViewChild('obj', { static: false }) input: ElementRef; // remove { static: false } if you're using Angular < 8 

    @Input() size: any;
    @Input() formato: any;
    @Input() value: any;
    @Input() disabled = false;
    @Input() style = "";
    respuesta = "";
    @Input() style_respuesta = "";
    @Input() editable = false;
    //pendiente = false;
    //pendiente_valor = "";
    //id="";
    @Input() valor_positivo = false;
    @Input() cursor = "";

    @Output()
    datachange: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    dropdown: EventEmitter<string> = new EventEmitter<string>();

    constructor(private elementRef: ElementRef) {
        this.formato = this.elementRef.nativeElement.getAttribute('formato');
        this.disabled = parseBoolean(this.elementRef.nativeElement.getAttribute('disabled'));
        this.editable = parseBoolean(this.elementRef.nativeElement.getAttribute('editable'));
        this.size = this.elementRef.nativeElement.getAttribute('size');
        this.value = this.elementRef.nativeElement.getAttribute('value');
        this.style = this.elementRef.nativeElement.getAttribute('style');
        this.style_respuesta = this.elementRef.nativeElement.getAttribute('style_respuesta');
        this.valor_positivo = parseBoolean(elementRef.nativeElement.getAttribute('valor_positivo'));
    }

    ngOnInit(): void {

        if (this.disabled == undefined || this.disabled == null) {
            this.disabled = false;
        }

        if (this.editable == undefined || this.editable == null) {
            this.editable = false;
        }
 
        if (this.formato == undefined) {
            this.formato = "";
        }

        if (this.valor_positivo == undefined || this.valor_positivo == null) {
            this.valor_positivo = false;
        }
 
        if (this.size == undefined) {
            this.size = 15;
        }

    }

    ondropdown() {
        if (this.disabled == false) {
            this.dropdown.emit("dropdown");
        }
        else if (this.editable == true) {
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

    setvalue(valuex: number) {
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
