import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonFile } from '@app/shared/models/common-file';
import { DialogSendFileResponse } from '@app/shared/models/dialog-send-file-response';
import { AttachmentType } from '@app/shared/utils/constants/attachmentType';
import { FileTypeHelper } from '@app/shared/utils/file-type-helper';

@Component({
  selector: 'app-dialog-send-file',
  templateUrl: './dialog-send-file.component.html',
  styleUrls: ['./dialog-send-file.component.scss']
})
export class DialogSendFileComponent implements OnInit {

  comment: string;
  attachmentType: AttachmentType;

  constructor(
    public dialogRef: MatDialogRef<DialogSendFileComponent, DialogSendFileResponse>,
    @Inject(MAT_DIALOG_DATA) public file: CommonFile,
    private fileTypeHelper: FileTypeHelper,
  ) {
    this.attachmentType = this.fileTypeHelper.getFileTypeByUrl(this.file.name);
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  sendFile() {
    const response = new DialogSendFileResponse({
      file: this.file,
      comment: this.comment,
    })
    this.dialogRef.close(response);
  }

  onFileLoad(file) {
    console.log("file bb", file.width);
  }

}
