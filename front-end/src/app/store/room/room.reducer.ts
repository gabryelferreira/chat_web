import { IAction } from '../action';
import { RoomActions } from './room.actions';
import { ROOM_INITIAL_STATE, IRoomState } from './room.model';
import { IRoom } from '@app/shared/models/room';
import { IParticipant } from '@app/shared/models/participant';
import { RoomType } from '@app/shared/utils/constants/roomType';

export function roomReducer(state: IRoomState = ROOM_INITIAL_STATE, action: IAction): IRoomState {
	switch (action.type) {
		case RoomActions.SET_INITIAL_STATE:
			return ROOM_INITIAL_STATE;
		case RoomActions.SET_SELECTED_ROOM:
			return {
				...state,
				selectedRoom: action.payload,
				rooms: state.rooms.map(room => {
					const isActionRoom = action.payload === room.uuid;
					const unreadMessages = isActionRoom ? 0 : room.unreadMessages;
					return {
						...room,
						unreadMessages,
						deleted: isActionRoom ? false : room.deleted,
					};
				})
			};
		case RoomActions.ADD_MESSAGE:
			return {
				...state,
				rooms: state.rooms.map(room => {
					const isActionRoom = action.payload.roomUUID === room.uuid;
					const isNotSelectedRoom = state.selectedRoom !== room.uuid;
					const unreadMessages = isActionRoom && isNotSelectedRoom ? room.unreadMessages + 1 : room.unreadMessages;
					return {
						...room,
						unreadMessages,
						deleted: unreadMessages > 0 ? false : room.deleted,
					};
				}),
			};
		case RoomActions.ADD_ROOM:
			return {
				...state,
				rooms: [...state.rooms, action.payload],
			};
		case RoomActions.SET_ROOM_DELETED:
			return {
				...state,
				rooms: state.rooms.map(room => ({
					...room,
					deleted: room.uuid === (action.payload.room as IRoom).uuid ? action.payload.deleted : room.deleted,
				})),
			}
		case RoomActions.REMOVE_ROOM:
			return {
				...state,
				rooms: state.rooms.filter(room => room.uuid !== action.payload),
			}
		case RoomActions.SET_ROOM:
			return {
				...state,
				rooms: state.rooms.map(room => {
					if (room.uuid !== (action.payload as IRoom).uuid) return room;
					return {
						...action.payload as IRoom,
						deleted: (action.payload as IRoom).unreadMessages > 0 ? false : room.deleted,
					}
				}),
			}
		case RoomActions.SET_ROOM_MAIN_INFO:
			return {
				...state,
				rooms: state.rooms.map(room => {
					if (room.uuid !== (action.payload as IRoom).uuid) return room;
					return {
						...room,
						name: (action.payload as IRoom).name,
						imgUrl: (action.payload as IRoom).imgUrl,
					}
				}),
			}
		case RoomActions.REMOVE_PARTICIPANT:
			return {
				...state,
				rooms: state.rooms.filter(room => {
					if (room.uuid !== action.payload.roomUUID) return true;
					return !action.payload.isLoggedUser;
				}).map(room => {
					if (room.uuid !== action.payload.roomUUID) return room;
					return {
						...room,
						participants: room.participants.filter(p => p.uuid !== (action.payload.participant as IParticipant).uuid),
					}
				}),
			}
		case RoomActions.ADD_PARTICIPANT:
			return {
				...state,
				rooms: action.payload.isLoggedUser ?
					[...state.rooms, action.payload.room] :
					state.rooms.map(room => {
						if (room.uuid !== (action.payload.room as IRoom).uuid) return room;
						return {
							...room,
							participants: [...room.participants, action.payload.participant]
						}
					})
			}
		case RoomActions.SET_USER_TYPING:
			return {
				...state,
				rooms: state.rooms.map(room => {
					if (room.uuid !== action.payload.roomUUID) return room;
					return {
						...room,
						participants: room.participants.map(participant => {
							if (participant.user.uuid !== action.payload.user.uuid) return participant;
							return {
								...participant,
								isTyping: action.payload.isTyping,
							}
						})
					}
				})
			}
		default:
			return state;
	}
}