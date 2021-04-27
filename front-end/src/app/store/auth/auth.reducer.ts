import { IAction } from '../action';
import { AuthActions } from './auth.actions';
import { AUTH_INITIAL_STATE, IAuthState } from './auth.model';

export function authReducer(state: IAuthState = AUTH_INITIAL_STATE, action: IAction): IAuthState {
	switch (action.type) {
		case AuthActions.SET_DATA:
			return action.payload;
		case AuthActions.UPDATE_USER:
			return {
				...state,
				user: action.payload,
			}
		default:
			return state;
	}
}