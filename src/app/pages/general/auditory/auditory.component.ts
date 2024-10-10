import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AuditoryService } from './service/auditory.service';
import { AuditData } from './interface/audit.model';

@Component({
  selector: 'app-auditory',
  templateUrl: './auditory.component.html',
  styleUrls: ['./auditory.component.scss']
})
export class AuditoryComponent implements OnInit {
  displayedColumns: string[] = ['entity', 'userId', 'operation', 'dateTime'];
  dataSource = new MatTableDataSource<AuditData>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(private auditoryService: AuditoryService) {}

  ngOnInit(): void {
    this.auditoryService.getAuditData().subscribe(
      (response: any) => {
        console.log('response:', response);
        this.dataSource.data = response.data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
