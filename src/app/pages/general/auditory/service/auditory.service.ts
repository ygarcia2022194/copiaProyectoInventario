import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditData } from '../interface/audit.model';

@Injectable({
  providedIn: 'root'
})
export class AuditoryService {

  private auditUrl = `${environment.urlMain}/audit/list`;

  constructor(private http: HttpClient) { }

  getAuditData(): Observable<AuditData[]> {
    return this.http.get<AuditData[]>(this.auditUrl);
  }
}
