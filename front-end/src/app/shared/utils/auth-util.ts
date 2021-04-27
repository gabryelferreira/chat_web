import { IAppState } from "@app/store/app.state";
import { Injectable } from "@angular/core";
import { Store, State } from "@ngrx/store";

@Injectable({
    providedIn: "root"
})
export class AuthUtil {
    
    constructor(
        private state: State<IAppState>,
    ){}

	getExpirationDate(expiresIn: number) {
		const date = new Date();
		date.setSeconds(date.getSeconds() + expiresIn);
		return date;
	}

	getMinutosRestantesToken() {
		const state: IAppState = this.state.getValue();
        const dataExpiracao = new Date(state.auth.accessToken.expirationDate);
        if (!dataExpiracao) return 0;
		const minutosExpiracao = (dataExpiracao.getTime() - Date.now()) / 60000;
		return minutosExpiracao;
	}

	getMinutosRestantesRefreshToken() {
		const state: IAppState = this.state.getValue();
        const dataExpiracao = new Date(state.auth.refreshToken.expirationDate);
        if (!dataExpiracao) return 0;
		const minutosExpiracao = (dataExpiracao.getTime() - Date.now()) / 60000;
		return minutosExpiracao;
	}

}