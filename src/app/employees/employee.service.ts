import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../core/model/Employee';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private api = environment.baseUrl + 'employees';

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<Employee[]>(`${this.api}?_expand=department`);
  }

  listByDepartment(depId: number) {
    return this.http.get<Employee[]>(
      `${this.api}?departmentId=${depId}&_expand=department`
    );
  }
  
  create(emp: Omit<Employee, 'id'>) { return this.http.post<Employee>(this.api, emp); }
  update(emp: Employee) { return this.http.put<Employee>(`${this.api}/${emp.id}`, emp); }
  delete(id: number) { return this.http.delete(`${this.api}/${id}`); }
}
