import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CreateAccountDTO } from '@app/shared/models/dto/create-account.dto';
import { environment } from '@env/environment';
import { catchError, map } from 'rxjs/operators';
import { ServiceHelper } from './service.helper';
import { Subject } from 'rxjs';
import { CustomHttpClient } from './custom-http-client.service';
import { LoginDTO } from '@app/shared/models/dto/login.dto';
import { AuthUserDTO } from '@app/shared/models/dto/auth-user.dto';
import { HttpError } from '@app/shared/models/http-error';
import { AuthHttpClient } from './auth-http-client.service';
import { IRoom } from '@app/shared/models/room';
import { IMessage } from '@app/shared/models/message';

@Injectable({
	providedIn: 'root'
})
export class RoomService {

	private allRoomsSource = new Subject<HttpResponse<IRoom[] | HttpError>>();
	allRoomsData$ = this.allRoomsSource.asObservable();

	private getMessagesSource = new Subject<HttpResponse<IMessage[] | HttpError>>();
	getMessagesData$ = this.getMessagesSource.asObservable();

	private readRoomMessagesSource = new Subject<HttpResponse<any | HttpError>>();
	readRoomMessagesData$ = this.readRoomMessagesSource.asObservable();

	private getPrivateRoomAndCreateSource = new Subject<HttpResponse<IRoom | HttpError>>();
	getPrivateRoomAndCreateData$ = this.getPrivateRoomAndCreateSource.asObservable();

	constructor(
		private http: AuthHttpClient,
		private serviceHelper: ServiceHelper,
    ) { }
    
	getAllRooms() {
		this.http.get<IRoom[]>(environment.api.allRooms)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'getAllRooms'))
			)
			.subscribe(response => {
				this.allRoomsSource.next(response);
			});
	}

	getMessages(roomUUID: string, before: string = "", limit: number = 50) {
		this.http.get<IMessage[]>(`${environment.api.roomMessages.replace("{uuid}", roomUUID)}?before=${before}&limit=${limit}`)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'getMessages'))
			)
			.subscribe(response => {
				this.getMessagesSource.next(response);
			});
	}

	getPrivateChatAndCreateIfNotExists(userUUID: string) {
		this.http.post<IRoom>(environment.api.privateRoomByUserUUID.replace("{uuid}", userUUID), null)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'getPrivateChatAndCreateIfNotExists'))
			)
			.subscribe(response => {
				this.getPrivateRoomAndCreateSource.next(response);
			});
	}

}
