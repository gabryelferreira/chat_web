import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Store, select, State } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IAppState } from '@app/store/app.state';
import { IAuthState } from '@app/store/auth/auth.model';
import { AuthActions } from '@app/store/auth/auth.actions';
import { IRoom } from '@app/shared/models/room';
import { RoomActions } from '@app/store/room/room.actions';
import { RoomService } from '@app/core/services/room.service';
import * as io from 'socket.io-client';
import { environment } from '@env/environment';
import { SocketHelper } from '@app/shared/utils/socket-helper';
import { IAction } from '@app/store/action';
import { IMessage } from '@app/shared/models/message';
import { ActivatedRoute, Router } from '@angular/router';
import { IAttachment } from '@app/shared/models/attachment';
import { IAuthUser } from '@app/shared/models/auth-user';
import { DialogSendFileResponse } from '@app/shared/models/dialog-send-file-response';
import { CreateMessageResponseDTO } from '@app/shared/models/dto/create-message-response.dto';
import { ISignedUrl } from '@app/shared/models/signed-url';
import { ISocketMessage } from '@app/shared/models/socket-message';
import { RoomType } from '@app/shared/utils/constants/roomType';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { UploadHelper } from '@app/shared/utils/upload-helper';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-chat-screen',
  templateUrl: './chat-screen.component.html',
  styleUrls: ['./chat-screen.component.scss']
})
export class ChatScreenComponent implements OnInit, OnDestroy {


  messages: IMessage[] = [];
  message: string;

  noMoreMessages: boolean = false;
  loadingInitial: boolean = true;
  loadingMoreMessages: boolean = false;

  isFirstLoad: boolean = true;

  firstMessage: IMessage;

  selectedChat: IRoom;
  user: IAuthUser;

  chatParticipantsListOpened: boolean = true;
  isCreatingChat: boolean = false;
  isLeavingRoom: boolean = false;
  isUploadingFile: boolean = false;

  messagesSearchLength: number = 50;

  isUserGroupAdmin: boolean = false;

  userTyping: string;
  isLoggedUserTyping: boolean = false;

  selectedChatSubscription: Subscription;
  getMessagesSubscription: Subscription;
  newMessageReceivedSubscription: Subscription;
  createMessageResponseSubscription: Subscription;

  roomsSubscription: Subscription;

  constructor(
    private store: Store<IAppState>,
    private service: RoomService,
    private state: State<IAppState>,
    private socketHelper: SocketHelper,
    private defaultDialog: DefaultDialog,
    private uploadHelper: UploadHelper,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.initUser();

    this.route.params.subscribe(params => {

      const state: IAppState = this.state.getValue();
      const rooms = state.room.rooms;

      const findRoom = rooms.find(x => x.uuid === params.uuid);

      if (!findRoom) {
        this.router.navigate(["/"]);
        return;
      }

      if (!this.selectedChat || this.selectedChat.uuid !== findRoom.uuid) {
        this.setLoggedUserTyping(false);
        this.selectedChat = { ...findRoom };
        this.initChat();
        this.message = null;
        this.verifyUsersTyping();
      }

    })

    // this.selectedChatSubscription = this.store.select((state: IAppState) => state.room.selectedRoom)
    //   .subscribe((selectedRoom: string) => {

    //     if (!selectedRoom) return;

        
    //   })

    this.roomsSubscription = this.store.select((state: IAppState) => state.room)
      .subscribe(room => {
        const selectedRoom = this.route.snapshot.params.uuid;
        const rooms = room.rooms;

        const chat = rooms.find(x => x.uuid === selectedRoom);

        if (chat) {
          this.selectedChat = chat;
          this.verifyUsersTyping();
          this.verifyUserGroupAdmin();
        } else {
          this.router.navigate(['/']);
        }


      })

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.selectedChatSubscription?.unsubscribe();
    this.roomsSubscription?.unsubscribe();

    this.destroyHttpListeners();
    this.destroySocketListeners();
  }

  initChat() {
    this.initHttpListeners();
    this.initSocketListeners();
    this.messages = [];
    this.loadingMoreMessages = false;
    this.loadingInitial = true;
    this.isFirstLoad = true;
    this.noMoreMessages = false;
    this.verifyUserGroupAdmin();
    this.getMessages();
  }

  @HostListener("document:mousewheel")
  onScroll() {
    const element = document.getElementById("message-content");
    if (element.scrollTop < 200 && this.selectedChat.uuid) {
      this.getMessages();
    }
  }

  verifyUserGroupAdmin() {
    this.isUserGroupAdmin = false;
    if (this.selectedChat?.idRoomType === RoomType.GROUP) {
      const findUser = this.selectedChat.participants.find(x => x.user.uuid === this.user.uuid);
      this.isUserGroupAdmin = findUser?.isAdmin;
    }
  }

  initHttpListeners() {
    this.destroyHttpListeners();

    this.getMessagesSubscription = this.service.getMessagesData$.subscribe(response => {
      this.loadingInitial = false;
      this.loadingMoreMessages = false;
      if (response.status === 200) {
        const messages = response.body as IMessage[];
        if (messages.length < this.messagesSearchLength) {
          this.noMoreMessages = true;
        }
        this.messages = [...messages, ...this.messages];
        if (this.isFirstLoad) {
          this.scrollToBottom();
        } else {
          this.handleScrollById(`chat-message-${this.firstMessage?.uuid}`)
        }
      } else {
        this.noMoreMessages = true;
      }
      this.isFirstLoad = false;
    })

  }

  destroyHttpListeners() {
    this.getMessagesSubscription?.unsubscribe();
  }

  initSocketListeners() {
    this.destroySocketListeners();

    this.newMessageReceivedSubscription = this.socketHelper.newMessageReceivedData$.subscribe((props: ISocketMessage) => {
      if (props.roomUUID === this.selectedChat.uuid) {
        this.messages.push(props.message);
        this.socketHelper.readRoomMessages(this.selectedChat.uuid);

        this.isWindowScrolled() && this.scrollToBottom();
      }
    })
    this.createMessageResponseSubscription = this.socketHelper.createMessageResponseData$.subscribe((props: CreateMessageResponseDTO) => {
      if (props.roomUUID === this.selectedChat.uuid) {
        this.messages = this.messages.map(message => {
          if (message.fakeUUID !== props.fakeMessageUUID) return message;
          else return props.message;
        })
      }
    })
  }

  destroySocketListeners() {
    if (this.newMessageReceivedSubscription)
      this.newMessageReceivedSubscription.unsubscribe();

    if (this.createMessageResponseSubscription)
      this.createMessageResponseSubscription.unsubscribe();
  }

  initUser(): void {
    const state: IAppState = this.state.getValue();
    this.user = state.auth.user;
  }

  getMessages(): void {
    if (!this.loadingMoreMessages && !this.noMoreMessages) {
      this.loadingMoreMessages = true;
      const messages = this.messages;
      this.firstMessage = messages.length > 0 ? messages[0] : null
      this.service.getMessages(this.selectedChat.uuid, this.firstMessage?.uuid, this.messagesSearchLength);
    }
  }

  validateCreateMessage(): void {
    if (!this.message || !this.message.trim()) return;

    if (this.selectedChat.uuid) {
      this.createMessage(this.message);
      return;
    }

    if (!this.selectedChat.uuid) {
      const user = this.selectedChat.participants[0].user;
      this.isCreatingChat = true;
      this.service.getPrivateChatAndCreateIfNotExists(user.uuid);
    }

  }

  private createMessage(message: string, attachment?: IAttachment, signedUrlUUID?: string): void {
    const fakeMessageUUID = uuidv4();
    const messageModel: IMessage = {
      fakeUUID: fakeMessageUUID,
      createdAt: new Date(),
      updatedAt: new Date(),
      message,
      user: this.user,
      uuid: null,
      attachment,
    };
    this.socketHelper.createMessage(this.selectedChat.uuid, messageModel, signedUrlUUID);
    this.messages.push(messageModel);
    this.message = null;
    this.setLoggedUserTyping(false);
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        const element = document.getElementById("message-content");
        if (!element) return;
        element.scrollTop = element.scrollHeight;
      }, 0);
    } catch (err) {
    }
  }

  handleScrollById(id: string): void {
    try {
      setTimeout(() => {
        const element = document.getElementById(id);
        if (!element) return;
        const messagesElement = document.getElementById("message-content");
        messagesElement.scrollTop = element.offsetTop - 25;
      }, 0);
    } catch (err) {
    }
  }

  isWindowScrolled(): boolean {
    const element = document.getElementById("message-content");
    if (!element) return;
    const windowHeight = window.innerHeight;
    return element.scrollTop >= element.scrollHeight - windowHeight - 300;
  }

  toggleChatParticipantsListOpened() {
    this.chatParticipantsListOpened = !this.chatParticipantsListOpened;
  }

  leaveRoom() {
    this.isLeavingRoom = true;
  }

  verifyUsersTyping() {
    if (this.selectedChat?.participants?.length > 0) {
      const participants = this.selectedChat.participants;
      const userTyping = participants.find(p => p.isTyping && p.user.uuid !== this.user.uuid);
      if (userTyping) {
        this.userTyping = `${userTyping.user.name} está digitando...`;
      } else {
        this.userTyping = null;
      }
    } else {
      this.userTyping = null;
    }
  }

  verifyLoggedUserTyping() {
    if (this.selectedChat?.uuid) {
      if (this.message?.length > 0 && !this.isLoggedUserTyping) {
        this.setLoggedUserTyping(true);
      }
      else if (this.message?.length === 0 && this.isLoggedUserTyping) {
        this.setLoggedUserTyping(false);
      }
    }
  }

  setLoggedUserTyping(isTyping: boolean) {
    if (this.isLoggedUserTyping === isTyping) return;
    this.isLoggedUserTyping = isTyping;
    this.socketHelper.setIsTyping(this.selectedChat.uuid, isTyping);
  }

  async onFileSent(response: DialogSendFileResponse) {
    this.isUploadingFile = true;
    let signedUrl: ISignedUrl;
    try {
      signedUrl = await this.uploadHelper.upload(response.file);
    } catch (e) {
      this.isUploadingFile = false;
      this.defaultDialog.openDialog("UM ERRO ACONTECEU", "Ocorreu um erro ao tentar fazer upload de sua imagem. Tente novamente em alguns minutos.");
      return;
    }
    this.isUploadingFile = false;

    const attachment: IAttachment = {
      uuid: null,
      type: response.file?.attachmentType,
      url: signedUrl?.finalUrl,
      height: response.file?.dimensions?.height,
      width: response.file?.dimensions?.width,
    }

    this.createMessage(response.comment, attachment, signedUrl.uuid);
  }

}