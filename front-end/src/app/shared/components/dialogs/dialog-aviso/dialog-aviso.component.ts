import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDefaultDialogOptions } from '@app/shared/models/default-dialog-options';
import { DialogAvisoData } from '@app/shared/models/dialog-aviso-data';
import { IDefaultDialogButton } from '@app/shared/models/default-dialog-button';

@Component({
  selector: 'dialog-aviso',
  templateUrl: './dialog-aviso.component.html',
  styleUrls: ['./dialog-aviso.component.scss']
})
export class DialogAvisoComponent implements OnInit {

  data: DialogAvisoData;
  buttons: IDefaultDialogButton[];

  constructor(
    public dialogRef: MatDialogRef<DialogAvisoComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: DialogAvisoData,
  ) {
    this.data = _data;
    this.buttons = _data.options.buttons;
  }

  ngOnInit(): void {
  }

  onButtonClick(button?: IDefaultDialogButton) {
    this.dialogRef.close(button?.value);
  }

}
