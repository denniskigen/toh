import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

const BASE_URL = 'http://localhost:3000/heroes';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http
      .get<Hero[]>(BASE_URL)
      .pipe(
        tap(
          heroes => this.log(`fetched heroes`),
          catchError(this.handleError(`getHeroes`, []))
        )
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${BASE_URL}/${id}`;

    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero with id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  createHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(BASE_URL, hero, httpOptions).pipe(
      tap(_ => this.log(`added hero with id=${hero.id}`)),
      catchError(this.handleError<Hero>(`created hero with id=${hero.id}`))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    const url = `${BASE_URL}/${hero.id}`;

    return this.http.put(url, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero with id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  deleteHero(hero: Hero): Observable<Hero> {
    const url = `${BASE_URL}/${hero.id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${hero.id}`)),
      catchError(this.handleError<any>(`deleteHero`))
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.http.get<Hero[]>(`${BASE_URL}/?q=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string): void {
    this.messageService.messages.push(message);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
