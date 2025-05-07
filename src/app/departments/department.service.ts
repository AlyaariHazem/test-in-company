import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Department } from '../core/model/department';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Employee } from '../core/model/Employee';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  public api = environment.baseUrl + 'departments';
  constructor(private http: HttpClient) { }

  list(): Observable<Department[]> {
    return this.http.get<Department[]>(this.api);
  }

  create(dep: Department) {
    return this.http.post<Department>(this.api, dep);
  }

  update(dep: Department) {
    return this.http.put<Department>(`${this.api}/${dep.id}`, dep);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
  listByDepartment(depId: number) {
    return this.http.get<Employee[]>(`${this.api}?departmentId=${depId}`);
  }
}
