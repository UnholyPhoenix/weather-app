import { Observable, of } from 'rxjs';

import { Credentials, LoginContext } from './authentication.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    username: 'test',
    apiId: '123',
    location: 'lj',
    unit: 'metric'
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      username: context.username,
      apiId: '123456',
      location: 'lj',
      unit: 'metric'
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }
}
