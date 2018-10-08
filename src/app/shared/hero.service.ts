import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Hero } from './hero';

const BASE_URL = 'http://localhost:3000/heroes';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(BASE_URL);
  }

  getHero(id: number): Observable<Hero> {
    const url = `${BASE_URL}/${id}`;

    return this.http.get<Hero>(url);
  }

  createHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(BASE_URL, hero, httpOptions);
  }

  updateHero(hero: Hero): Observable<any> {
    const url = `${BASE_URL}/${hero.id}`;

    return this.http.put(url, hero, httpOptions);
  }

  deleteHero(hero: Hero): Observable<Hero> {
    const url = `${BASE_URL}/${hero.id}`;

    return this.http.delete<Hero>(url, httpOptions);
  }
}
