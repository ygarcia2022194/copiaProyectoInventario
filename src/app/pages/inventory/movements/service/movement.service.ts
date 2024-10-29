import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovementData } from '../interface/movement.model';

@Injectable({
  providedIn: 'root'
})
export class MovementService {

  private movementList = environment.movementUrl.movementList;
  private movementHistory = environment.movementUrl.movementHistory;
  private movementEntry = environment.movementUrl.confirmEntry

  constructor(private http: HttpClient) { }

  getMovementList(page: number = 0, size: number = 8): Observable<MovementData> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<MovementData>(this.movementList, { params });
  }

  getMovementHistory(page: number = 0, size: number = 8): Observable<MovementData> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };
    return this.http.get<MovementData>(this.movementHistory, { params });
  }

  confirmMovementEntry(movementId: number): Observable<any> {
    return this.http.put(`${this.movementEntry}/${movementId}`, {});
  }
}  
