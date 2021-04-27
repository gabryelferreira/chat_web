import { Directive, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';

@Directive({
    selector: '[fileDrop]'
})
export class FileDropDirective {

    constructor() { }

    @Output() dropped = new EventEmitter<FileList>();
    @Output() hovered = new EventEmitter<boolean>();

    @HostBinding('style.background-color') private background = '#F6F8FB'
    @HostBinding('style.opacity') private opacity = '1'

    @HostListener('drop', ['$event'])
    onDrop(evt) {
        evt.preventDefault();
        this.dropped.emit(evt.dataTransfer.files);
        this.hovered.emit(false);
        this.background = '#F6F8FB';
        this.opacity = '1'
    }

    @HostListener('dragover', ['$event'])
    onDragOver(evt) {
        evt.preventDefault();
        this.hovered.emit(true);
        this.background = '#9ecbec';
        this.opacity = '0.8';
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(evt) {
        evt.preventDefault();
        this.hovered.emit(false);
        this.background = '#F6F8FB';
        this.opacity = '1';
    }

}
