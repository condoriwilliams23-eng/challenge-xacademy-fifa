import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { PlayerListComponent } from './components/player-list/player-list.component';
import { PlayerComponent } from './components/player/player';
import { PlayerFormComponent } from './components/player-form/player-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'players', component: PlayerListComponent, canActivate: [authGuard] },
  { path: 'players/create', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'players/:id', component: PlayerComponent, canActivate: [authGuard] },
  { path: 'players/:id/edit', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: '**', redirectTo: 'players' },
];
