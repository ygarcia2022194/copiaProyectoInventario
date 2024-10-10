import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {  User, UserData } from '../../users/interface/users.module';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private postUserUrl = environment.apiUrls.postUser;
  constructor(private http: HttpClient) {}

  postUser(userData: User): Observable<UserData> {
    return this.http.post<UserData>(this.postUserUrl, userData);
  }
}
