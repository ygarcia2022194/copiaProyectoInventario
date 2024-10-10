import { Component, OnInit } from '@angular/core';
import { ListReusable } from 'src/app/shared/interfaces/table-column';
import { ProfilesService } from './service/profiles.service';
import { ProfileData, Profile } from './interface/profile.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  profilesData: Profile[] = [];
  profileColumns: ListReusable[] = [
    { def: 'name', header: 'Nombre de Usuario' }
  ];

  roles: string[] = [
    'ROLE_PROFILE',
    'ROLE_USERS',
    'ROLE_WINERY',
    'ROLE_PRODUCT',
    'ROLE_INVENTORY',
    'ROLE_AUDIT',
    'ROLE_CATEGORY',
    'ROLE_USER',
    'ROLE_ADMIN'
  ];

  selectedRoles: string[] = [];
  name = '';
  description = '';
  selectedProfileId: string | null = null;
  isEditing = false;

  constructor(
    public profilesService: ProfilesService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.profilesService.getData().subscribe((response: ProfileData) => {
      this.profilesData = response.data.content;
    });
  }

  createOrUpdateProfile(): void {
    this.isEditing && this.selectedProfileId ? this.updateProfile() : this.createProfile();
  }

  createProfile(): void {
    const profileData: Profile = {
      profileId: 0,
      name: this.name,
      description: this.description,
      status: true,
      resource: this.selectedRoles
    };

    this.blockUI.start(this.translate.instant('LOADING'));

    this.profilesService.createProfile(profileData).subscribe({
      next: () => {
        this.resetForm();
        this.loadProfiles();
        this.snackBar.open(
          this.translate.instant('PROFILES.CREATE_SUCCESS'),
          this.translate.instant('PROFILES.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('PROFILES.CREATE_ERROR'),
          this.translate.instant('PROFILES.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }

  updateProfile(): void {
    const profileData: Profile = {
      profileId: Number(this.selectedProfileId),
      name: this.name,
      description: this.description,
      status: true,
      resource: this.selectedRoles
    };
    this.blockUI.start(this.translate.instant('LOADING'));

    this.profilesService.updateProfile(Number(this.selectedProfileId), profileData).subscribe({
      next: () => {
        this.resetForm();
        this.loadProfiles();
        this.snackBar.open(
          this.translate.instant('PROFILES.UPDATE_SUCCESS'),
          this.translate.instant('PROFILES.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('PROFILES.UPDATE_ERROR'),
          this.translate.instant('PROFILES.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }

  onItemSelected(item: any): void {
    if (item) {
      this.selectedProfileId = item.profileId;
      this.name = item.name;
      this.description = item.description;
      this.selectedRoles = item.resource || [];
      this.isEditing = true;
    } else {
      this.resetForm();
      this.isEditing = false;

    }
  }

  resetForm(): void {
    this.name = '';
    this.description = '';
    this.selectedRoles = [];
    this.selectedProfileId = null;
    this.isEditing = false;
  }
}
