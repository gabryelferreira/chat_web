import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { ChatScreenComponent } from './chat-screen/chat-screen.component';
import { LoginComponent } from './login/login.component';
import { UserGuard } from './shared/guards/user.guard';
import { NonAuthGuard } from './shared/guards/non-auth.guard';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { SearchUsersComponent } from './search-users/search-users.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';

const routes: Routes = [
	{
		path: '',
		component: PageLayoutComponent,
		children: [
			{
				path: '',
				component: HomeScreenComponent,
				canActivate: [UserGuard],
			},
			{
				path: 'buscar',
				component: SearchUsersComponent,
				canActivate: [UserGuard],
			},
			{
				path: 'perfil',
				component: ProfileComponent,
				canActivate: [UserGuard],
			},
			{
				path: 'chat/:uuid',
				component: ChatScreenComponent,
				canActivate: [UserGuard],
			}
		]
	},
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [NonAuthGuard],
	},
	{
		path: '**',
		redirectTo: "/"
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes),
		SharedModule,
	],
	declarations: [
		ChatScreenComponent,
		LoginComponent,
		PageLayoutComponent,
		SearchUsersComponent,
		ProfileComponent,
		HomeScreenComponent,
	],
	exports: [
		RouterModule,
		ChatScreenComponent,
		LoginComponent,
		PageLayoutComponent,
		SearchUsersComponent,
		ProfileComponent,
		HomeScreenComponent,
	]
})
export class AppRoutingModule { }
