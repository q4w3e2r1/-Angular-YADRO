import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, shareReplay, tap, catchError, retry, throwError, BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  private userDetailsCache: { [key: number]: BehaviorSubject<User> } = {};

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.http.get<User[]>(this.apiUrl).subscribe(users => {
      this.usersSubject.next(users);
      users.forEach(user => {
        this.userDetailsCache[user.id] = new BehaviorSubject<User>(user);
      });
    });
  }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserById(id: number): Observable<User> {
    if (!this.userDetailsCache[id]) {
      this.http.get<User>(`${this.apiUrl}/${id}`).subscribe(user => {
        this.userDetailsCache[id] = new BehaviorSubject<User>(user);
      });
    }
    return this.userDetailsCache[id].asObservable();
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while creating the user.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
      tap(newUser => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
        this.userDetailsCache[newUser.id] = new BehaviorSubject<User>(newUser);
      })
    );
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while updating the user.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
      tap(updatedUser => {
        const currentUsers = this.usersSubject.value;
        const updatedUsers = currentUsers.map(u => 
          u.id === updatedUser.id ? updatedUser : u
        );
        this.usersSubject.next(updatedUsers);
        
        if (this.userDetailsCache[id]) {
          this.userDetailsCache[id].next(updatedUser);
        }
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred while deleting the user.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      }),
      tap(() => {
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next(currentUsers.filter(u => u.id !== id));
        delete this.userDetailsCache[id];
      })
    );
  }
}