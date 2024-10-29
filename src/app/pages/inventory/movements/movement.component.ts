import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MovementService } from './service/movement.service';
import { Movement, MovementData } from './interface/movement.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-movements',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementsComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  displayedColumns: string[] = [
    'nameProduct',
    'nameWinery',
    'nameUser',
    'quantity',
    'totalPrice',
    'operationType',
    'dateMovement',
    'action'
  ];
  displayedColumnsHistory: string[] = [
    'movementId',
    'nameProduct',
    'nameWinery',
    'nameUser',
    'quantity',
    'totalPrice',
    'operationType',
    'dateMovement',
  ];
  dataSource = new MatTableDataSource<Movement>();
  historySource = new MatTableDataSource<Movement>();
  currentPage = 0;
  pageSize = 8;
  totalElementsMovements: number = 0;
  totalElementsHistory: number = 0; 
  movementsData: Movement[] = [];
  showConfirmCancelButtons: { [key: number]: boolean } = {};
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private movementService: MovementService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadMovements();
    this.loadMovementsHistory();
  }

  loadMovements(page: number = this.currentPage, size: number = this.pageSize): void {
    this.movementService.getMovementList(page, size).subscribe((response: MovementData) => {
      this.movementsData = response.data.content;
      this.totalElementsMovements = response.data.totalElements;
      this.dataSource.data = this.movementsData;
    });
  }

  loadMovementsHistory(page: number = this.currentPage, size: number = this.pageSize): void {
    this.movementService.getMovementHistory(page, size).subscribe((response: MovementData) => {
      this.movementsData = response.data.content;
      this.totalElementsHistory = response.data.totalElements;
      this.historySource.data = this.movementsData;
    });
  }

  confirmEntry(movementId: number): void {
    this.showConfirmCancelButtons[movementId] = true;
  }

  onConfirm(movementId: number): void {
    this.blockUI.start(this.translate.instant('LOADING'));

    this.movementService.confirmMovementEntry(movementId).subscribe({
      next: (response) => {
        this.snackBar.open(
          this.translate.instant('MOVEMENT.MSJ_SUCCESS'),
          this.translate.instant('MOVEMENT.CLOSE'),
          { duration: 3000 }
        );
        this.loadMovements();
        this.loadMovementsHistory();

        this.showConfirmCancelButtons[movementId] = false;
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('MOVEMENT.MSJ_ERROR'),
          this.translate.instant('MOVEMENT.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }

  onCancel(movementId: number): void {
    this.showConfirmCancelButtons[movementId] = false;
  }

  handlePageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovements();
  }
}
