import { Component, Input, ViewChild, OnInit, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ListReusable } from '../../interfaces/table-column';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { UsersService } from 'src/app/pages/general/users/service/users.service';
import { ProfilesService } from 'src/app/pages/general/profile/service/profiles.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.scss'],
})
export class ListTableComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  dataSource: any[] = [];
  tableDisplayColumns: string[] = [];
  tableColumns: ListReusable[] = [];
  paginatedData: any[] = [];
  pageSize = 8;
  currentPage = 0;
  selectedItem: any = null;

  @Input() dataType: 'users' | 'profiles' = 'users';
  @Input() userService!: UsersService; 
  @Input() profileService!: ProfilesService;  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() set data(data: any) {
    this.dataSource = data;
    this.updatePaginatedData();
  }

  @Input() set columns(columns: ListReusable[]) {
    this.tableColumns = columns;
    this.tableDisplayColumns = this.tableColumns.map((col) => col.def);
  }

  @Output() itemSelected = new EventEmitter<any>();

  constructor(
    private dialog: MatDialog, 
    private snackBar: MatSnackBar, 
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.setColumnsAndData();
  }

  setColumnsAndData() {
    if (this.dataType === 'users') {
      this.tableDisplayColumns = ['username', 'email', 'status'];
    } else if (this.dataType === 'profiles') {
      this.tableDisplayColumns = ['name', 'description', 'status'];
    }
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  selectItem(item: any): void {
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
    console.log('Elemento seleccionado:', this.selectedItem);
    this.itemSelected.emit(this.selectedItem);
  }

  deleteItem(): void {
    if (this.selectedItem) {
      const itemType = this.dataType === 'users' ? 'user' : 'profile';
      console.log('ID del elemento a eliminar:', this.selectedItem.id);
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '250px',
        data: { item: this.selectedItem, type: itemType },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (itemType === 'user') {
            this.blockUI.start(this.translate.instant('LOADING'));
            this.userService.deleteUserById(this.selectedItem.id).subscribe({
              next: (response) => {
                this.dataSource = this.dataSource.filter((item: any) => item !== this.selectedItem);
                this.updatePaginatedData();
                this.snackBar.open(this.translate.instant('USER.DELETE_SUCCESS'), this.translate.instant('USER.CLOSE'), {
                  duration: 3000,
                });
                this.blockUI.stop();
              },
              error: (error) => {
                console.error('Error al eliminar el usuario:', error);
                this.snackBar.open(this.translate.instant('USER.DELETE_ERROR'), this.translate.instant('USER.CLOSE'), {
                  duration: 3000,
                });
                this.blockUI.stop();
              }
            });
          } else if (itemType === 'profile') {
            this.blockUI.start(this.translate.instant('LOADING'));
            this.profileService.deleteProfileById(this.selectedItem.profileId).subscribe({
              next: (response) => {
                this.dataSource = this.dataSource.filter((item: any) => item !== this.selectedItem);
                this.updatePaginatedData();
                this.snackBar.open(this.translate.instant('PROFILES.DELETE_SUCCESS'), this.translate.instant('PROFILES.CLOSE'), {
                  duration: 3000,
                });
                this.selectedItem = null;
              this.itemSelected.emit(this.selectedItem);
                this.blockUI.stop();
              },
              error: (error) => {
                console.error('Error al eliminar el perfil:', error);
                this.snackBar.open(this.translate.instant('PROFILES.DELETE_ERROR'), this.translate.instant('PROFILES.CLOSE'), {
                  duration: 3000,
                });
                this.blockUI.stop();
              }
            });
          }
        }
      });
    }
  }
  
}
