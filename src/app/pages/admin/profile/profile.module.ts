import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms'; 
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatGridListModule,
    MatListModule,
    FormsModule,
    MatSelectModule,
    TranslateModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  exports: [
    ProfileComponent
  ],
  declarations: [
    ProfileComponent
  ],
  providers: [
  ],
})
export class ProfileModule { }