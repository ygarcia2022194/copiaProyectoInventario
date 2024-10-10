import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile, ProfileData } from '../interface/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  private getUrl = environment.profileUrl.getProfiles;
  private createUrl = environment.profileUrl.createProfile;
  private deleteUrl = environment.profileUrl.deleteProfile;
  private updateUrl = environment.profileUrl.updateProfile;

  constructor(private http: HttpClient) {}

  getData(): Observable<ProfileData> {
    return this.http.get<ProfileData>(this.getUrl);
  }

  createProfile(profileData: Profile): Observable<ProfileData> {
    return this.http.post<ProfileData>(this.createUrl, profileData);
  }

  deleteProfileById(id: number): Observable<ProfileData> {
    return this.http.delete<ProfileData>(`${this.deleteUrl}/${id}`);
  }

  updateProfile(id: number, profileData: Profile): Observable<ProfileData> {
    return this.http.put<ProfileData>(`${this.updateUrl}/${id}`, profileData);
  }
}
