import { Routes } from '@angular/router';
import { UserDetailPageComponent } from './pages/user-detail-page/user-detail-page.component';
import { UsersListPageComponent } from './pages/users-list-page/users-list-page.component';
import { UserFormPageComponent } from './pages/user-form-page/user-form-page.component';

export const routes: Routes = [
  { path: '', component: UsersListPageComponent },
  { path: 'user/new', component: UserFormPageComponent },
  { path: 'user/:id', component: UserDetailPageComponent },
  { path: 'user/:id/edit', component: UserFormPageComponent }
];
