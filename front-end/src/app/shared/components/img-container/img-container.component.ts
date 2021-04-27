import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FileHelper } from '@app/shared/utils/file-helper';
import { CommonFile } from '@app/shared/models/common-file';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'img-container',
  templateUrl: './img-container.component.html',
  styleUrls: ['./img-container.component.scss'],
})
export class ImgContainerComponent implements OnInit {

  @Input("src") src: string;
  @Input("matIcon") matIcon: string = "person";

  file: CommonFile;

  inputId: string;

  @Output("onChange") onChange = new EventEmitter<CommonFile>();

  constructor(
    private fileHelper: FileHelper,
  ) {
    this.inputId = uuidv4();
  }

  ngOnInit(): void {
  }

  async onFileChange(event: any) {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    const commonFile = await this.fileHelper.getFormattedFile(file);
    if (commonFile) {
      this.src = commonFile.src as string;
      this.file = commonFile;
      this.onChange.emit(this.file);
    }
  }

  removeAvatar() {
    this.src = null;
    this.file = null;
    this.onChange.emit(null);
    const element = document.getElementById(this.inputId) as HTMLInputElement;
    element.value = "";
  }

}
