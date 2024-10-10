import { Component, OnInit } from '@angular/core';
import { UsersService } from './service/users.service';
import { ListReusable } from 'src/app/shared/interfaces/table-column';
import { ProfilesService } from '../profile/service/profiles.service';
import { ProfileData, Profile } from '../profile/interface/profile.model';
import { User, UserData } from './interface/users.module';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  usersData: User[] = [];
  userColumns: ListReusable[] = [
    { def: 'name', header: 'Nombre' },
    { def: 'correo', header: 'email' }
  ];
  buttonLabel: string = 'Guardar';
  newUser: User = {
    id: 0,
    email: '',
    name: '',
    surname: '',
    username: '',
    age: 0,
    phone: '',
    profileId: 0,
    status: true,
    resource: [] 
  };
  successMessage: string | null = null;
  errorMessage: string |  null = null;
  profilesData: Profile[] = [];
  selectedProfileId: number | null = null;
  isEditing = false;

  constructor(
    public userService: UsersService, 
    public profilesService: ProfilesService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProfiles();
  }

  loadUsers(): void {
    this.userService.getData().subscribe((response: UserData) => {
      this.usersData = response.data.content;
    });
  }

  loadProfiles(): void {
    this.profilesService.getData().subscribe((response: ProfileData) => {
      this.profilesData = response.data.content;
    });
  }

  createOrUpdateUser(): void {
    this.isEditing ? this.updateUser() : this.createUser();
  }

  createUser(): void {
    const userData: User = {
      ...this.newUser,
      id: 0 
    };
  
    this.blockUI.start(this.translate.instant('LOADING'));
    this.userService.postUser(userData).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
        this.snackBar.open(
          this.translate.instant('USER.CREATE_SUCCESS'),
          this.translate.instant('USER.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('USER.CREATE_ERROR'),
          this.translate.instant('USER.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }

  updateUser(): void {
    const userDataToUpdate = {
      email: this.newUser.email,
      name: this.newUser.name,
      surname: this.newUser.surname,
      age: this.newUser.age,
      phone: this.newUser.phone,
      username: this.newUser.username
    };
    
    this.blockUI.start(this.translate.instant('LOADING'));
    this.userService.updateUser(this.newUser.id, userDataToUpdate).subscribe({
      next: () => {
        this.resetForm();
        this.loadUsers();
        this.snackBar.open(
          this.translate.instant('USER.UPDATE_SUCCESS'), 
          this.translate.instant('USER.CLOSE'),
          { duration: 5000 }
        );
        this.resetForm();
        this.loadUsers();
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('USER.UPDATE_ERROR'), 
          this.translate.instant('USER.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }

  onUserSelected(user: User): void {
    if (user) {
      this.newUser = { ...user }; 
      this.selectedProfileId = user.profileId;
      this.isEditing = true;
      this.buttonLabel = 'Actualizar'; 
    } else {
      this.resetForm(); 
    }
  }

  resetForm(): void {
    this.newUser = {
      id: 0,
      email: '',
      name: '',
      surname: '',
      username: '',
      age: 0,
      phone: '',
      profileId: 0,
      status: true,
      resource: [] 
    };
    this.selectedProfileId = null; 
    this.isEditing = false; 
    this.buttonLabel = 'Guardar'; 
  }
}