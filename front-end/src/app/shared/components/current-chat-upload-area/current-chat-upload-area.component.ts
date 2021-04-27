import { Component, OnInit, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FileHelper } from '@app/shared/utils/file-helper';
import { CommonFile } from '@app/shared/models/common-file';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSendFileComponent } from '../dialogs/dialog-send-file/dialog-send-file.component';
import { Observable, Subscription } from 'rxjs';
import { DialogSendFileResponse } from '@app/shared/models/dialog-send-file-response';
import { DefaultDialog } from '@app/shared/utils/default-dialog';

@Component({
  selector: 'current-chat-upload-area',
  templateUrl: './current-chat-upload-area.component.html',
  styleUrls: ['./current-chat-upload-area.component.scss']
})
export class CurrentChatUploadAreaComponent implements OnInit, OnDestroy {

  @Output("onSubmit") onSubmit = new EventEmitter<DialogSendFileResponse>();

  isHovering: boolean = false;

  fileSentSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private fileHelper: FileHelper,
    private defaultDialog: DefaultDialog,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.fileSentSubscription)
      this.fileSentSubscription.unsubscribe();
  }

  @HostListener("window:dragover", ["$event"])
  onDragOver(e) {
    e.preventDefault();
    this.isHovering = true;
  }

  @HostListener("window:dragleave", ["$event"])
  onDragLeave(e) {
    e.preventDefault();
    if (!e.fromElement) {
      this.isHovering = false;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(e) {
    e.preventDefault();
    this.isHovering = false;
    this.handleDropFiles(e.dataTransfer.files as FileList);
  }

  private async handleDropFiles(files: FileList) {
    const filesToSave: CommonFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = await this.fileHelper.getFormattedFile(files.item(i));
      filesToSave.push(file);
    }
    if (filesToSave.length > 0) {
      const file = filesToSave[0];
      const allowedFiles = [...this.fileHelper.imageAllowedExts, ...this.fileHelper.videoAllowedFiles];
      const isFileExtValid = this.fileHelper.isFileExtValid(file, allowedFiles);
      if (!isFileExtValid) {
        this.defaultDialog.openDialog("ARQUIVO NÃO PERMITIDO", "No momento, são permitidos apenas vídeos e imagens.");
        return;
      }
      const isFileSizeValid = this.fileHelper.isFileSizeValid(file);
      if (!isFileSizeValid) {
        this.defaultDialog.openDialog("ARQUIVOS MUITO PODEROSOS", "No momento, o tamanho máximo de arquivos é de 10.00 MB.");
        return;
      }
      this.openDialogSendFile(file);
    }
  }

  private openDialogSendFile(file: CommonFile) {
    const config = this.configureDialogSendFile(file);
    const dialog = this.dialog.open(DialogSendFileComponent, config);
    dialog.afterClosed().subscribe(response => {
      if (response) {
        this.onSubmit.emit(response);
      }
    })
  }

  private configureDialogSendFile(file: CommonFile): MatDialogConfig<CommonFile> {
    const config = new MatDialogConfig<CommonFile>();
    config.panelClass = "dialog-overflow-visible";
    config.width = "500px";
    config.disableClose = true;
    config.data = file;
    return config;
  }



}
