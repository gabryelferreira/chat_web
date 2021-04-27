import { Injectable, OnDestroy } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "@env/environment";
import { State, Store } from "@ngrx/store";
import { IAppState } from "@app/store/app.state";
import { Subscription, Subject } from "rxjs";
import { IAction } from "@app/store/action";
import { SocketAction } from "./constants/socketAction";
import { ISocketMessage } from "../models/socket-message";
import { IRoom } from "../models/room";
import { RoomActions } from "@app/store/room/room.actions";
import { SoundHelper } from "./sound-helper";
import { IMessage } from "../models/message";
import { CreateMessageDTO } from "../models/dto/create-message.dto";
import { v4 as uuidv4 } from 'uuid';
import { IAuthUser } from "../models/auth-user";
import { CreateMessageResponseDTO } from "../models/dto/create-message-response.dto";
import { CreateGroupRoomDTO } from "../models/dto/create-group-room.dto";
import { Router } from "@angular/router";
import { DefaultDialog } from "./default-dialog";
import { RemoveParticipantDTO } from "../models/dto/remove-participant.dto";
import { RemoveParticipantResponseDTO } from "../models/dto/remove-participant-response.dto";
import { AddParticipantDTO } from "../models/dto/add-participant.dto";
import { AddParticipantResponseDTO } from "../models/dto/add-participant-response.dto";
import { UpdateGroupRoomDTO } from "../models/dto/update-group-room.dto";
import { SetIsTypingResponse } from "../models/set-is-typing-response";

@Injectable({
    providedIn: "root"
})
export class SocketHelper implements OnDestroy {

    private newMessageReceivedSource = new Subject<ISocketMessage>();
    newMessageReceivedData$ = this.newMessageReceivedSource.asObservable();
    
    private createMessageResponseSource = new Subject<CreateMessageResponseDTO>();
    createMessageResponseData$ = this.createMessageResponseSource.asObservable();
    
    private addParticipantResponseSource = new Subject<AddParticipantResponseDTO>();
    addParticipantResponseData$ = this.addParticipantResponseSource.asObservable();
    
    private createRoomResponseSource = new Subject<IRoom>();
    createRoomResponseData$ = this.createRoomResponseSource.asObservable();
    
    private createRoomErrorSource = new Subject<any>();
    createRoomErrorData$ = this.createRoomErrorSource.asObservable();
    
    private updateRoomResponseSource = new Subject<IRoom>();
    updateRoomResponseData$ = this.updateRoomResponseSource.asObservable();
    
    private updateRoomErrorSource = new Subject<any>();
    updateRoomErrorData$ = this.updateRoomErrorSource.asObservable();

    socket: SocketIOClient.Socket;
    connecting: boolean = false;

    listenToLoginSubscription: Subscription;

    accessToken: string;

    constructor(
        private state: State<IAppState>,
        private store: Store<IAppState>,
        private soundHelper: SoundHelper,
        private router: Router,
        private defaultDialog: DefaultDialog,
    ) {
        this.listenToLoginSubscription = this.store.select((state: IAppState) => state.auth)
            .subscribe(auth => {
                if (!auth) {
                    this.disconnectSocket();
                } else {
                    if (this.accessToken !== auth.accessToken.token) {
                        this.disconnectSocket();
                        this.accessToken = auth.accessToken.token;
                    }
                    this.initializeSocket();
                }
            })
    }

    get loggedUser(): IAuthUser {
        const state: IAppState = this.state.getValue();
        return state.auth.user;
    }

    ngOnDestroy(): void {
        if (this.listenToLoginSubscription)
            this.listenToLoginSubscription.unsubscribe();
    }

    disconnectSocket() {
        this.socket?.close();
        this.connecting = false;
    }

    initializeSocket() {
        if (!this.socket?.connected && !this.connecting) {
            this.connecting = true;
            const state: IAppState = this.state.getValue();
            const token = state.auth?.accessToken.token;

            this.socket = io(environment.api.socketConnection, {
                query: {
                    token,
                }
            });

            this.socket.on("connection", () => {
                console.log("connected!");
                this.connecting = false;
            })

            this.listenToSocketEvents();
        }
    }

    listenToSocketEvents() {
        this.socket.on(SocketAction.NEW_MESSAGE_RECEIVED, (props: ISocketMessage) => {
            const state: IAppState = this.state.getValue();
            if (state.auth.user.uuid !== props.message.user.uuid) {
                this.store.dispatch(RoomActions.addMessage(props.roomUUID, props.message));
                this.soundHelper.playNotificationSound();
            }
            this.newMessageReceivedSource.next(props);
        })

        this.socket.on(SocketAction.NEW_ROOM, (room: IRoom) => {
            this.store.dispatch(RoomActions.addRoom(room));
            this.socket.emit("join", room.uuid);
        })

        this.socket.on(SocketAction.CREATE_MESSAGE_RESPONSE, (response: CreateMessageResponseDTO) => {
            this.createMessageResponseSource.next(response);
        })

        this.socket.on(SocketAction.CREATE_ROOM_RESPONSE, (room: IRoom) => {
            this.store.dispatch(RoomActions.addRoom(room));
            this.router.navigate([`/chat/${room.uuid}`]);
            this.createRoomResponseSource.next(room);
        })

        this.socket.on(SocketAction.CREATE_ROOM_ERROR, (title: string, subtitle?: string) => {
            this.defaultDialog.openDialog(title, subtitle);
            this.createRoomErrorSource.next();
        })
        this.socket.on(SocketAction.REMOVE_PARTICIPANT_ERROR, (title: string, subtitle?: string) => {
            this.defaultDialog.openDialog(title, subtitle);
        })
        this.socket.on(SocketAction.REMOVE_PARTICIPANT_RESPONSE, (props: RemoveParticipantResponseDTO) => {
            this.handleRemoveParticipantResponse(props);
        })
        this.socket.on(SocketAction.ADD_PARTICIPANT_RESPONSE, (props: AddParticipantResponseDTO) => {
            this.handleAddParticipantResponse(props);
            this.addParticipantResponseSource.next(props);
        })
        this.socket.on(SocketAction.ADD_PARTICIPANT_ERROR, (title: string, subtitle?: string) => {
            this.defaultDialog.openDialog(title, subtitle);
        })
        this.socket.on(SocketAction.PARTICIPANT_LEFT_ROOM, (room: IRoom) => {
            this.store.dispatch(RoomActions.setRoom(room));
        });
        this.socket.on(SocketAction.ROOM_UPDATED, (room: IRoom) => {
            this.store.dispatch(RoomActions.setRoomMainInfo(room));
        });
        this.socket.on(SocketAction.SET_IS_TYPING, (props: SetIsTypingResponse) => {
            this.handleSetIsTypingResponse(props);
        })
    }

    createMessage(roomUUID: string, message: IMessage, attachmentSignedUrlUUID?: string) {
        const createMessageDTO = new CreateMessageDTO({
            roomUUID,
            message: message.message,
            fakeMessageUUID: message.fakeUUID,
            attachmentSignedUrlUUID,
        });
        this.store.dispatch(RoomActions.addMessage(roomUUID, message));
        this.socket.emit(SocketAction.CREATE_MESSAGE, createMessageDTO);
    }

    readRoomMessages(roomUUID: string) {
        this.socket.emit(SocketAction.READ_ROOM_MESSAGES, roomUUID);
    }

    createGroup(name: string, signedUrlUUID?: string) {
        const createGroupDTO = new CreateGroupRoomDTO({
            name,
            signedUrlUUID,
        });
        this.socket.emit(SocketAction.CREATE_ROOM, createGroupDTO);
    }

    updateGroup(props: UpdateGroupRoomDTO) {
        this.socket.emit(SocketAction.UPDATE_ROOM, props, this.updateGroupCallback.bind(this));
    }

    updateGroupCallback(room?: IRoom, error?: string) {
        if (error) {
            this.defaultDialog.openDialog("UM ERRO ACONTECEU", error);
            this.updateRoomErrorSource.next(error);
        } else {
            this.store.dispatch(RoomActions.setRoomMainInfo(room));
            this.updateRoomResponseSource.next(room);
        }
    }

    removeParticipant(roomUUID: string, participantUUID: string) {
        const removeParticipantDTO = new RemoveParticipantDTO({
            roomUUID,
            participantUUID,
        });
        this.socket.emit(SocketAction.REMOVE_PARTICIPANT, removeParticipantDTO);
    }

    handleRemoveParticipantResponse(props: RemoveParticipantResponseDTO) {
        const state: IAppState = this.state.getValue();
        const user = state.auth.user;
        const isLoggedUser = props.participant.user.uuid === user.uuid;
        if (isLoggedUser) {
            this.socket.emit("leave", props.roomUUID);
        }
        this.store.dispatch(RoomActions.removeParticipant(props.roomUUID, props.participant, isLoggedUser));
    }

    handleAddParticipantResponse(props: AddParticipantResponseDTO) {
        const state: IAppState = this.state.getValue();
        const user = state.auth.user;
        const isLoggedUser = props.participant.user.uuid === user.uuid;
        if (isLoggedUser) {
            this.socket.emit("join", props.room.uuid);
        }
        this.store.dispatch(RoomActions.addParticipant(props.room, props.participant, isLoggedUser));
    }

    addParticipant(roomUUID: string, userUUID: string) {
        const addParticipantDTO = new AddParticipantDTO({
            roomUUID,
            userUUID,
        })
        this.socket.emit(SocketAction.ADD_PARTICIPANT, addParticipantDTO);
    }

    leaveRoom(roomUUID: string) {
        this.socket.emit(SocketAction.LEAVE_ROOM, roomUUID, this.leaveRoomCallback.bind(this));
    }

    leaveRoomCallback(room?: IRoom, error?: string) {
        if (error) {
            this.defaultDialog.openDialog("UM ERRO ACONTECEU", error);
        } else {
            this.store.dispatch(RoomActions.removeRoom(room.uuid));
        }
    }

    setIsTyping(roomUUID: string, isTyping: boolean) {
        this.socket.emit(SocketAction.SET_IS_TYPING, roomUUID, isTyping);
    }

    handleSetIsTypingResponse(props: SetIsTypingResponse) {
        this.store.dispatch(RoomActions.setUserTyping(props.roomUUID, props.user, props.isTyping));
    }

}