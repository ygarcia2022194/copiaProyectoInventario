import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/general/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'forgetPassword',
    loadChildren: () => import('./pages/general/forget-password/forget-password.module').then(m => m.ForgetPasswordModule)
  },
  {
    path: 'changePassword',
    loadChildren: () => import('./pages/general/change-password/change-password.module').then(m => m.ChangePasswordModule)
  },
  {
    path: 'notFound',
    loadChildren: () => import('./pages/general/not-found/not-found.module').then(m => m.NotFoundModule)
  },
  {
    path: 'restorePassword',
    loadChildren: () => import('./pages/general/restore-password/restore-password.module').then(m => m.RestorePasswordModule)
  },
  {
    path: 'profiles',
    loadChildren: () => import('./pages/general/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/general/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'auditory',
    loadChildren: () => import('./pages/general/auditory/auditory.module').then(m => m.AuditoryModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/general/register/register.module').then(m => m.RegisterModule)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'notFound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
