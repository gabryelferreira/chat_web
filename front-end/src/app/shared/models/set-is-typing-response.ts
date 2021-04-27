import { IAuthUser } from "./auth-user";

export class SetIsTypingResponse {
    roomUUID: string;
    user: IAuthUser;
    isTyping: boolean;
}