import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { BubbleTea, BubbleTeaFilter } from '../../shared/models/bubbletea.model';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  ok: boolean;
  result: T;
}

@Injectable({ providedIn: 'root' })
export class BubbleTeaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/bubbleteas`;

  private readonly _bubbleteas = signal<BubbleTea[]>([]);
  readonly bubbleteas = this._bubbleteas.asReadonly();

  getAll(filter?: BubbleTeaFilter): Observable<BubbleTea[]> {
    let params = new HttpParams();
    if (filter?.temperature) params = params.set('temperature', filter.temperature);
    if (filter?.activeOnly) params = params.set('active', 'true');
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<ApiResponse<BubbleTea[]>>(this.baseUrl, { params }).pipe(
      map(res => res.result),
      tap(data => this._bubbleteas.set(data))
    );
  }

  getById(id: number): Observable<BubbleTea> {
    return this.http.get<ApiResponse<BubbleTea>>(`${this.baseUrl}/${id}`).pipe(
      map(res => res.result)
    );
  }

  create(bubbletea: Omit<BubbleTea, 'id'>): Observable<BubbleTea> {
    return this.http.post<ApiResponse<BubbleTea>>(this.baseUrl, bubbletea).pipe(
      map(res => res.result),
      tap(created => this._bubbleteas.update(list => [...list, created]))
    );
  }

  update(id: number, bubbletea: Partial<BubbleTea>): Observable<BubbleTea> {
    return this.http.put<ApiResponse<BubbleTea>>(`${this.baseUrl}/${id}`, bubbletea).pipe(
      map(res => res.result),
      tap(updated =>
        this._bubbleteas.update(list =>
          list.map(item => item.id === id ? updated : item)
        )
      )
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0),
      tap(() => this._bubbleteas.update(list => list.filter(item => item.id !== id)))
    );
  }

  toggleActive(id: number, active: boolean): Observable<BubbleTea> {
    return this.update(id, { active });
  }
}