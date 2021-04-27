import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DialogAddParticipantComponent } from "../components/dialogs/dialog-add-participant/dialog-add-participant.component";
import { DialogManageGroupComponent } from "../components/dialogs/dialog-manage-group/dialog-manage-group.component";
import { DialogShowImageComponent } from "../components/dialogs/dialog-show-image/dialog-show-image.component";
import { DialogAddParticipantData } from "../models/dialog-add-participant-data";
import { IRoom } from "../models/room";

@Injectable({
    providedIn: "root"
})
export class DialogHelper {

    constructor(
        private dialog: MatDialog,
    ) { }

    openDialogShowImage(imageUrl: string) {
        const config = this.configureDialogShowImage(imageUrl);
        this.dialog.open(DialogShowImageComponent, config);
    }

    private configureDialogShowImage(imageUrl: string): MatDialogConfig<string> {
        const config = new MatDialogConfig<string>();
        config.data = imageUrl;
        config.maxHeight = "95vh";
        config.maxWidth = "95%";
        return config;
    }

    openAddParticipantDialog(room: IRoom) {
        const config = this.configureAddParticipantDialog(room);
        this.dialog.open(DialogAddParticipantComponent, config);
    }

    private configureAddParticipantDialog(room: IRoom): MatDialogConfig {
        const config = new MatDialogConfig();
        config.width = "420px";
        config.height = "420px";
        const data = new DialogAddParticipantData({
            room,
        });
        config.data = data;

        return config;
    }

    openManageGroupDialog(room: IRoom) {
        const config = this.configureManageGroupDialog(room);
        this.dialog.open(DialogManageGroupComponent, config);
    
      }
    
      private configureManageGroupDialog(room: IRoom): MatDialogConfig<DialogManageGroupComponent> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "450px";
        dialogConfig.data = room;
        return dialogConfig;
      }

}