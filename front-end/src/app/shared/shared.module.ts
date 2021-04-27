import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HeaderComponent } from '@app/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatLoaderComponent } from './components/chat-loader/chat-loader.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAvisoComponent } from './components/dialogs/dialog-aviso/dialog-aviso.component';
import { TitleDescriptionComponent } from '@app/title-description/title-description.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogAddParticipantComponent } from './components/dialogs/dialog-add-participant/dialog-add-participant.component';
import { LoggedUserInfoComponent } from './components/logged-user-info/logged-user-info.component';
import { LoaderBackgroundComponent } from './components/loader-background/loader-background.component';
import { LinkifyPipe } from './pipes/linkify.pipe';
import { DialogManageGroupComponent } from './components/dialogs/dialog-manage-group/dialog-manage-group.component';
import { ImgContainerComponent } from './components/img-container/img-container.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileDropDirective } from './directives/file-drop.directive';
import { CurrentChatUploadAreaComponent } from './components/current-chat-upload-area/current-chat-upload-area.component';
import { DialogSendFileComponent } from './components/dialogs/dialog-send-file/dialog-send-file.component';
import { DialogShowImageComponent } from './components/dialogs/dialog-show-image/dialog-show-image.component';
import { ChatAttachmentComponent } from './components/chat-attachment/chat-attachment.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatParticipantsListComponent } from './components/chat-participants-list/chat-participants-list.component';
import { ChatHeaderComponent } from './components/chat-header/chat-header.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  declarations: [
    SideMenuComponent,
    HeaderComponent,
    ChatLoaderComponent,
    DialogAvisoComponent,
    TitleDescriptionComponent,
    DialogAddParticipantComponent,
    LoggedUserInfoComponent,
    LoaderBackgroundComponent,
    LinkifyPipe,
    DialogManageGroupComponent,
    ImgContainerComponent,
    FileDropDirective,
    CurrentChatUploadAreaComponent,
    DialogSendFileComponent,
    DialogShowImageComponent,
    ChatAttachmentComponent,
    ChatMessageComponent,
    ChatParticipantsListComponent,
    ChatHeaderComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,

    SideMenuComponent,
    HeaderComponent,
    ChatLoaderComponent,
    DialogAvisoComponent,
    TitleDescriptionComponent,
    DialogAddParticipantComponent,
    LoggedUserInfoComponent,
    LoaderBackgroundComponent,
    LinkifyPipe,
    DialogManageGroupComponent,
    ImgContainerComponent,
    FileDropDirective,
    CurrentChatUploadAreaComponent,
    DialogSendFileComponent,
    DialogShowImageComponent,
    ChatAttachmentComponent,
    ChatMessageComponent,
    ChatParticipantsListComponent,
    ChatHeaderComponent,
  ],
  entryComponents: [
    DialogAvisoComponent,
    DialogAddParticipantComponent,
    DialogManageGroupComponent,
    DialogSendFileComponent,
    DialogShowImageComponent,
  ],
})
export class SharedModule { }
