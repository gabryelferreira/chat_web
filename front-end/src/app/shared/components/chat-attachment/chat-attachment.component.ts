import { Component, Input, OnInit } from '@angular/core';
import { IAttachment } from '@app/shared/models/attachment';
import { DialogHelper } from '@app/shared/utils/dialog-helper';

@Component({
  selector: 'chat-attachment',
  templateUrl: './chat-attachment.component.html',
  styleUrls: ['./chat-attachment.component.scss']
})
export class ChatAttachmentComponent implements OnInit {

  @Input('attachment') attachment: IAttachment;

  constructor(
    private dialogHelper: DialogHelper,
  ) {}

  ngOnInit(): void {
    this.attachment = this.calculateAttachmentAspectRatioFit(this.attachment);
  }

  calculateAttachmentAspectRatioFit(attachment: IAttachment): IAttachment {

    if (!attachment || !attachment.height || !attachment.width) return attachment;

    const srcWidth = attachment.width;
    const srcHeight = attachment.height;

    const maxWidth = 400;
    const maxHeight = 400;

    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    const width = srcWidth * ratio;
    const height = srcHeight * ratio;

    return {
      ...attachment,
      height,
      width,
    };
  }

  openDialogShowImage(imageUrl: string) {
    this.dialogHelper.openDialogShowImage(imageUrl);
  }

}
