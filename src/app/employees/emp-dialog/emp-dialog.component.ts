import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../core/model/Employee';
import { DepartmentService } from '../../departments/department.service';
import { Department } from '../../core/model/department';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-emp-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DropdownModule,
    MatSelectModule
  ],
  templateUrl: './emp-dialog.component.html',
  styleUrl:'./emp-dialog.component.scss'
})
export class EmployeeDialogComponent {
  private fb = inject(FormBuilder);
  private depSrv = inject(DepartmentService);
  dialog = inject(MatDialogRef<EmployeeDialogComponent>);
  data = inject<Employee | null>(MAT_DIALOG_DATA);

  departments: Department[] = [];

  form = this.fb.nonNullable.group({
    id: this.fb.control<number | null>(null),
    fullName: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.email]),
    joiningDate: this.fb.control('', Validators.required),
    departmentId:  this.fb.control<number | null>(null, Validators.required),
    status: this.fb.control<'active' | 'inactive'>('active')
  });

  ngOnInit() {
    this.depSrv.list().subscribe(res => (this.departments = res));

    if (this.data) this.form.patchValue(this.data);
  }

  save() {
    if (this.form.invalid) return;
    const val = this.form.value;
    if (val.id == null) delete (val as any).id;
    this.dialog.close(val);
  }
}
