import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketHelper } from '@app/shared/utils/socket-helper';
import { CommonFile } from '@app/shared/models/common-file';
import { ISignedUrl } from '@app/shared/models/signed-url';
import { UploadHelper } from '@app/shared/utils/upload-helper';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { Subscription } from 'rxjs';
import { FileHelper } from '@app/shared/utils/file-helper';
import { IRoom } from '@app/shared/models/room';
import { UpdateGroupRoomDTO } from '@app/shared/models/dto/update-group-room.dto';

@Component({
  selector: 'app-dialog-manage-group',
  templateUrl: './dialog-manage-group.component.html',
  styleUrls: ['./dialog-manage-group.component.scss']
})
export class DialogManageGroupComponent implements OnInit, OnDestroy {

  room: IRoom;

  name: string;
  imgUrl: string | ArrayBuffer;

  creatingGroup: boolean = false;
  updatingGroup: boolean = false;
  file: CommonFile;

  createRoomResponseSubscription: Subscription;
  createRoomErrorSubscription: Subscription;

  updateRoomResponseSubscription: Subscription;
  updateRoomErrorSubscription: Subscription;

  constructor(
    private dialogRef: MatDialogRef<DialogManageGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: IRoom,
    private socketHelper: SocketHelper,
    private uploadHelper: UploadHelper,
    private defaultDialog: DefaultDialog,
    private fileHelper: FileHelper,
  ) {
    this.createRoomResponseSubscription = this.socketHelper.createRoomResponseData$.subscribe(room => {
      this.dialogRef.close();
    })
    this.createRoomErrorSubscription = this.socketHelper.createRoomErrorData$.subscribe(room => {
      this.creatingGroup = false;
    })
    this.updateRoomResponseSubscription = this.socketHelper.updateRoomResponseData$.subscribe(room => {
      this.dialogRef.close();
    })
    this.updateRoomErrorSubscription = this.socketHelper.updateRoomErrorData$.subscribe(room => {
      this.updatingGroup = false;
    })
    this.initRoom(_data);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.createRoomResponseSubscription)
      this.createRoomResponseSubscription.unsubscribe();

    if (this.createRoomErrorSubscription)
      this.createRoomErrorSubscription.unsubscribe();

    if (this.updateRoomResponseSubscription)
      this.updateRoomResponseSubscription.unsubscribe();

    if (this.updateRoomErrorSubscription)
      this.updateRoomErrorSubscription.unsubscribe();
  }

  initRoom(room?: IRoom) {
    this.room = room;
    this.name = room?.name;
    this.imgUrl = room?.imgUrl;
  }

  onFileChange(file: CommonFile) {
    this.file = file;
    this.imgUrl = file?.src;
  }

  validate(): boolean {
    if (!this.name || !this.name.trim()) {
      return false;
    }
    if (this.file && !this.fileHelper.isFileExtValid(this.file, this.fileHelper.imageAllowedExts)) {
      this.defaultDialog.openDialog(
        "ARQUIVO NÃO PERMITIDO",
        `O tipo de arquivo escolhido é inválido.`
      );
      return false;
    }
    return true;
  }

  async createGroup() {
    if (!this.validate()) return;
    this.creatingGroup = true;

    let signedUrl: ISignedUrl;
    if (this.file) {
      try {
        signedUrl = await this.uploadHelper.upload(this.file);
      } catch (_) {
        this.defaultDialog.openDialog("UM ERRO ACONTECEU", "Ocorreu um erro ao tentar fazer upload da imagem.");
        return;
      }
    }
    this.socketHelper.createGroup(this.name, signedUrl?.uuid);
  }

  async updateGroup() {
    if (!this.validate()) return;
    this.updatingGroup = true;

    let signedUrl: ISignedUrl;
    if (this.file) {
      try {
        signedUrl = await this.uploadHelper.upload(this.file);
      } catch (_) {
        this.defaultDialog.openDialog("UM ERRO ACONTECEU", "Ocorreu um erro ao tentar fazer upload da imagem.");
        return;
      }
    }
    const updateGroupDTO = new UpdateGroupRoomDTO({
      roomUUID: this.room.uuid,
      name: this.name,
      signedUrlUUID: signedUrl?.uuid,
      removeImage: !this.imgUrl && !!this.room.imgUrl,
    })
    this.socketHelper.updateGroup(updateGroupDTO);
  }

  close() {
    this.dialogRef.close();
  }

}
