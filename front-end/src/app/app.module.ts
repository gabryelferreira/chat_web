import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpCancelService, HttpRequestInterceptor } from './core/interceptors/http-request-interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { rootReducer } from './store/root.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ToastrModule } from 'ngx-toastr';
import { SocketHelper } from './shared/utils/socket-helper';

registerLocaleData(localePt);

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
	return localStorageSync({
		keys: ['auth', 'room'],
		rehydrate: true
	})(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		MatIconModule,
		MatToolbarModule,
		StoreModule.forRoot(rootReducer, { metaReducers }),
		ToastrModule.forRoot(),
	],
	providers: [
		HttpCancelService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpRequestInterceptor,
			multi: true
		},
		{ provide: LOCALE_ID, useValue: "pt" },
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(_: SocketHelper) { }
}
