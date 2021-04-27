import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { IDefaultDialogOptions } from "../models/default-dialog-options";
import { DialogAvisoData } from "../models/dialog-aviso-data";
import { DialogAvisoComponent } from "../components/dialogs/dialog-aviso/dialog-aviso.component";

@Injectable({
    providedIn: "root"
})
export class DefaultDialog {

    constructor(
        private dialog: MatDialog,
    ) { }

    openDialog(title: string, subtitle?: string, options: IDefaultDialogOptions = {}) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = "350px";
        dialogConfig.data = new DialogAvisoData({
            title,
            subtitle,
            options
        })

        var dialogRef = this.dialog.open(DialogAvisoComponent, dialogConfig);

        if (options && options.afterClosed) {
            dialogRef.afterClosed().subscribe(result => {
                options.afterClosed(result);
            });
        }
    }

}