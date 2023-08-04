import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
declare const acoplarseriemax: any;
declare const letraacentuada: any;
declare const parseBoolean: any;
declare const beep: any;

@Component({
    selector: 'treung-textarea',
    templateUrl: './treung-textarea.component.html',
    styleUrls: ['./treung-textarea.component.scss']
})
export class TreungTextareaComponent implements OnInit {

    @ViewChild('obj', { static: false }) input: ElementRef; // remove { static: false } if you're using Angular < 8 

    @Input() maxlength = 0;
    @Input() formato = "";
    @Input() value = "";
    //pendiente = false;
    //pendiente_valor = "";
    @Input() disabled = false;
    @Input() cols = 20;
    @Input() rows = 4;
    anterior_arrow = "";
    acento_pulsado = false;
    @Input() rezisable = false;
    dentro = false;

    @Output()
    copy: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    paste: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    cut: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    datachange: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    tab: EventEmitter<string> = new EventEmitter<string>();

    constructor(private elementRef: ElementRef) {
        this.maxlength = parseInt(this.elementRef.nativeElement.getAttribute('maxlength'));
        this.formato = this.elementRef.nativeElement.getAttribute('formato');
        this.disabled = parseBoolean(this.elementRef.nativeElement.getAttribute('disabled'));
        this.value = this.elementRef.nativeElement.getAttribute('value');
        this.rows = parseInt(this.elementRef.nativeElement.getAttribute('rows'));
        this.cols = parseInt(this.elementRef.nativeElement.getAttribute('cols'));
        this.rezisable = parseBoolean(this.elementRef.nativeElement.getAttribute('rezisable'));
    }

    ngOnInit(): void {

        if (this.disabled == undefined || this.disabled == null) {
            this.disabled = false;
        }

        if (this.formato == undefined || this.formato == null) {
            this.formato = "";
        }

    }

    ngAfterViewInit() {

        if (this.value != undefined) {
            this.setvalue(this.value);
        }

    }

    setvalue(valuex: string) {

        /*if (this.input.nativeElement.value == null) {
            this.pendiente = true;
            this.pendiente_valor = valuex;
            return;
        }*/

        if (this.maxlength > 0) {
            this.input.nativeElement.value = acoplarseriemax(valuex, this.maxlength);
        }
        else {
            this.input.nativeElement.value = valuex;
        }
        if (this.formato == "lowercase") {
            this.input.nativeElement.value = this.input.nativeElement.value.toLocaleLowerCase();
        }
        if (this.formato == "uppercase") {
            this.input.nativeElement.value = this.input.nativeElement.value.toLocaleUpperCase();
        }
        this.datachange.emit("datachange");

    }

    getvalue() {
        if (this.input.nativeElement.value == null) return "";
        return this.input.nativeElement.value;
    }

    onFocusGainTreuTextArea(e: any) {

        this.dentro = true;

        //this.input.nativeElement.select();

    }

    onFocusLostTreuTextArea(e: any) {

        this.dentro = false;

    }

    onKeyDownTreuTextArea(event: any) {

        var nuevo, format, posicion, inicial, cumple, termi;
        var i;
        var letra, letramod;

        /*if (this.onkeydown != "") {
            eval(this.onkeydown);
        }*/

        letra = event.key;

        if (letra == "Enter") {
            letra = "\n";
        }

        if (letra == "Tab") {
            this.tab.emit("tab");
            return true;
        }

        // Ctrl+C or Cmd+C pressed?
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 67) {
            // Do stuff.
            this.copy.emit("copy");
            return true;
        }

        // Ctrl+V or Cmd+V pressed?
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 86) {
            // Do stuff.
            this.paste.emit("paste");
            return true;
        }

        // Ctrl+X or Cmd+X pressed?
        if ((event.ctrlKey || event.metaKey) && event.keyCode == 88) {
            // Do stuff.
            this.cut.emit("cut");
            this.datachange.emit("datachange");
            //if (event.preventDefault) event.preventDefault();
            return true;
        }

        if (letra.length > 1 && letra !== "Backspace" && letra !== "Delete" && letra !== "Dead" && letra !== "ArrowLeft" && letra !== "ArrowRight") {
            if (event.preventDefault) event.preventDefault();
            return true;
        }

       //if (letra=="Dead") {
        if (event.keyCode == 229) {
            //this.acento_pulsado = true;
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
        }

        inicial = this.input.nativeElement.value;
        format = this.formato;
        posicion = this.input.nativeElement.selectionStart;
        termi = this.input.nativeElement.selectionEnd;

        nuevo = "";
        if (letra.length == 1) {

            if (this.acento_pulsado==true) {
                letra=letraacentuada(letra);
                this.acento_pulsado=false;
            }

            letramod = letra;
            if (format.toLowerCase() == "lowercase") {
                letramod = letra.toLocaleLowerCase();
            }

            if (format.toLowerCase() == "uppercase") {
                letramod = letra.toLocaleUpperCase();
            }

            nuevo = "";
            nuevo = nuevo + inicial.substring(0, posicion);
            nuevo = nuevo + letramod;
            nuevo = nuevo + inicial.substring(termi, inicial.length);

            //this.acento = false;

        } else if (letra === "Backspace") {
            if (posicion > 0 && (posicion == termi)) {
                nuevo = nuevo + inicial.substring(0, posicion - 1);
                nuevo = nuevo + inicial.substring(posicion, inicial.length);
                this.input.nativeElement.value = nuevo;
                this.input.nativeElement.selectionStart = posicion - 1;
                this.input.nativeElement.selectionEnd = posicion - 1;
                this.datachange.emit("datachange");
                event.preventDefault();
                return false;
            } else if (posicion == 0 && (posicion == termi)) {
                beep();
                event.preventDefault();
                return false;
            } else if (posicion != termi) {
                nuevo = nuevo + inicial.substring(0, posicion);
                nuevo = nuevo + inicial.substring(termi, inicial.length);
                this.input.nativeElement.value = nuevo;
                this.input.nativeElement.selectionStart = posicion;
                this.input.nativeElement.selectionEnd = posicion;
                this.datachange.emit("datachange");
                event.preventDefault();
                return false;
            }
        } else if (letra === "Delete") {
            if (posicion < inicial.length && posicion == termi) {
                nuevo = nuevo + inicial.substring(0, posicion);
                nuevo = nuevo + inicial.substring(posicion + 1, inicial.length);
                this.input.nativeElement.value = nuevo;
                this.input.nativeElement.selectionStart = posicion;
                this.input.nativeElement.selectionEnd = posicion;
                this.datachange.emit("datachange");
                event.preventDefault();
                return false;
            } else if (posicion == inicial.length) {
                beep();
                event.preventDefault();
                return false;
            } else if (posicion != termi) {
                nuevo = nuevo + inicial.substring(0, posicion);
                nuevo = nuevo + inicial.substring(termi, inicial.length);
                this.input.nativeElement.value = nuevo;
                this.input.nativeElement.selectionStart = posicion;
                this.input.nativeElement.selectionEnd = posicion;
                this.datachange.emit("datachange");
                event.preventDefault();
                return false;
            }
        } else if (letra === "ArrowLeft") {
            posicion--;
            if (posicion < 0) {
                posicion = 0;
            }
            if (!event.shiftKey) {
                this.input.nativeElement.selectionStart = posicion;
                this.input.nativeElement.selectionEnd = posicion;
            }
            else {
                if (this.input.nativeElement.selectionStart == this.input.nativeElement.selectionEnd) {
                    this.anterior_arrow = "ArrowLeft";
                }
                if (this.anterior_arrow != "ArrowRight") {
                    this.input.nativeElement.selectionStart = posicion;
                }
                else {
                    termi--;
                    if (termi >= this.input.nativeElement.selectionStart) {
                        this.input.nativeElement.selectionEnd = termi;
                    }
                    else {
                        this.anterior_arrow = "ArrowLeft";
                    }
                }
            }
            nuevo = this.input.nativeElement.value;
            event.preventDefault();
            return false;
        } else if (letra === "ArrowRight") {
            posicion++;
            if (posicion > this.input.nativeElement.value.length) {
                posicion = this.input.nativeElement.value.length;
            }
            if (!event.shiftKey) {
                this.input.nativeElement.selectionStart = posicion;
                this.input.nativeElement.selectionEnd = posicion;
            }
            else {
                if (this.input.nativeElement.selectionStart == this.input.nativeElement.selectionEnd) {
                    this.anterior_arrow = "ArrowRight";
                }
                if (this.anterior_arrow != "ArrowLeft") {
                    termi++;
                    if (termi > this.input.nativeElement.value.length) {
                        termi = this.input.nativeElement.value.length;
                    }
                    this.input.nativeElement.selectionEnd = termi;
                }
                else {
                    if (posicion <= this.input.nativeElement.selectionEnd) {
                        this.input.nativeElement.selectionStart = posicion;
                    }
                    else {
                        this.anterior_arrow = "ArrowRight";
                    }
                }
            }
            nuevo = this.input.nativeElement.value;
            event.preventDefault();
            return false;
        }
        else if (letra == "Dead") {
            nuevo = this.input.nativeElement.value;
            return true;
        }
        else {
            nuevo = this.input.nativeElement.value;
        }

        if (this.maxlength > 0) {
            if (nuevo.length > this.maxlength) {
                beep();
            }
            else {
                this.input.nativeElement.value = nuevo;
                this.input.nativeElement.selectionStart = posicion + letramod.length;
                this.input.nativeElement.selectionEnd = posicion + letramod.length;
                this.datachange.emit("datachange");
            }
        }
        else {
            this.input.nativeElement.value = nuevo;
            this.input.nativeElement.selectionStart = posicion + letramod.length;
            this.input.nativeElement.selectionEnd = posicion + letramod.length;
            this.datachange.emit("datachange");
        }

        event.preventDefault();
        return false;
    }

    onCutTreuTextArea(event: any) {

        var selection = this.input.nativeElement.value.substring(this.input.nativeElement.selectionStart,this.input.nativeElement.selectionEnd);
        event.clipboardData.setData('text/plain', selection.toString());
        this.input.nativeElement.value=this.input.nativeElement.value.substring(0,this.input.nativeElement.selectionStart)+this.input.nativeElement.value.substring(this.input.nativeElement.selectionEnd)
        event.preventDefault();
        return false;
        
    }

    onPasteTreuTextArea(event: any) {

        var nuevo, format, inicial, posicion, cumple, termi;
        var i;
        var letra, letramod;

        letra = event.clipboardData.getData('Text');

        if (letra.length == 0)
            return true;

        inicial = this.input.nativeElement.value;
        format = this.formato;
        posicion = this.input.nativeElement.selectionStart;
        termi = this.input.nativeElement.selectionEnd;

        letramod = letra;
        if (format.toLowerCase() == "lowercase") {
            letramod = letra.toLocaleLowerCase();
        }

        if (format.toLowerCase() == "uppercase") {
            letramod = letra.toLocaleUpperCase();
        }

        nuevo = "";
        nuevo = nuevo + inicial.substring(0, posicion);
        nuevo = nuevo + letramod;
        nuevo = nuevo + inicial.substring(termi, inicial.length);

        if (this.maxlength > 0) {
            if (nuevo.length > this.maxlength) {
                beep();
            }
            else {
                this.input.nativeElement.value = nuevo;
                this.input.nativeElement.selectionStart = posicion + letramod.length;
                this.input.nativeElement.selectionEnd = posicion + letramod.length;
                this.datachange.emit("datachange");

            }
        }
        else {
            this.input.nativeElement.value = nuevo;
            this.input.nativeElement.selectionStart = posicion + letramod.length;
            this.input.nativeElement.selectionEnd = posicion + letramod.length;
            this.datachange.emit("datachange");

        }

        if (event.preventDefault) event.preventDefault();
        return false;
    }

    focus() {
        this.input.nativeElement.focus();
    }

}
