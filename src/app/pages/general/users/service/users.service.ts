import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User, UserData, UserUpdate } from '../interface/users.module';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private deleteUrl = environment.apiUrls.deleteUsers;
  private postUserUrl = environment.apiUrls.postUser;
  private updateUsers = environment.apiUrls.updateUsers;
  private getUsers = environment.apiUrls.getUsers
  constructor(private http: HttpClient) {}
  getData(): Observable<UserData> {
    return this.http.get<UserData>(this.getUsers);
  }

  deleteUserById(id: string): Observable<any> {
    const url = `${this.deleteUrl}/${id}`;
    console.log('URL enviada para eliminar:', url); 
    return this.http.delete(url, { responseType: 'text' }).pipe(
      map((response: string) => {
        try {
          return JSON.parse(response);
        } catch (error) {
          console.warn('La respuesta no es JSON, se devuelve como texto.');
          return response;
        }
      }),
      catchError((error) => {
        console.error('Error en la petición:', error);
        return throwError(error);
      })
    );
  }
  postUser(userData: User): Observable<UserData> {
    return this.http.post<UserData>(this.postUserUrl, userData);
  }

  updateUser(userId: number, userData: UserUpdate): Observable<User> {
    const { email, name, surname, age, phone, username } = userData; 
    const dataToUpdate = {
      email,
      name,
      surname,
      age,
      phone, 
      username
    };
    return this.http.put<User>(`${this.updateUsers}/${userId}`, dataToUpdate).pipe(
      catchError((error) => {
        console.error('Error en la actualización del usuario:', error);
        return throwError(error);
      })
    );
  }
}
