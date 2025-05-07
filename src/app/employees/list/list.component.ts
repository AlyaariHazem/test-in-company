import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../../core/model/Employee';
import { EmployeeDialogComponent } from '../emp-dialog/emp-dialog.component';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    MatDialogModule,
    PaginatorModule
  ],
  providers: [ConfirmationService],
  templateUrl: './list.component.html',
})
export class ListComponent {
  private srv = inject(EmployeeService);
  private dialog = inject(MatDialog);
  private confirm = inject(ConfirmationService);
  private toast = inject(ToastrService);
  private route = inject(ActivatedRoute);

  employees: Employee[] = [];
  depId: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.depId = p.has('id') ? +p.get('id')! : null;
      this.load();
    });
  }

  load() {
    const req$ = this.depId == null
      ? this.srv.list()
      : this.srv.listByDepartment(this.depId);

    req$.subscribe(res => {
      this.employees = res;
      this.updatePagedEmployees(); // تحديث الصفحة المعروضة
    });
  }

  openDialog(emp?: Employee) {
    const init = emp ?? { departmentId: this.depId } as Employee;

    this.dialog.open(EmployeeDialogComponent, { data: init, width: '450px' })
      .afterClosed()
      .subscribe(result => {
        if (!result) return;

        const req$ = result.id
          ? this.srv.update(result)
          : this.srv.create(result);

        req$.subscribe({
          next: () => {
            this.toast.success('تم الحفظ');
            this.load();                // إعادة تحميل القائمة
          },
          error: () => this.toast.error('فشل الاتصال')
        });
      });
  }
  //why is the
  confirmDelete(emp?: Employee) {
    debugger
    console.log('the employee to delete', emp);
    this.confirm.confirm({
      message: `حذف الموظف «${emp!.fullName}»؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      accept: () => {
        this.srv.delete(emp!.id!).subscribe({
          next: () => {
            this.toast.success('تم الحذف');
            this.employees = this.employees.filter(e => e.id !== emp!.id);
            this.load();
          },
          error: () => this.toast.error('فشل الحذف')
        });
      }
    });
  }
  exportExcel() {
    const wb = new Workbook();
    const ws = wb.addWorksheet('Employees');

    /* العناوين */
    ws.addRow([
      'المعرف',
      'الاسم',
      'البريد',
      'القسم',
      'تاريخ الانضمام',
      'الحالة'
    ]);

    /* البيانات */
    this.employees.forEach(e =>
      ws.addRow([
        e.id,
        e.fullName,
        e.email,
        e.department?.name ?? '',
        e.joiningDate,
        e.status === 'active' ? 'نشط' : 'غير نشط'
      ])
    );

    /* بعض تنسيقات بسيطة */
    ws.columns.forEach(col => (col.width = 20));
    ws.getRow(1).font = { bold: true };

    /* حفظ الملف */
    wb.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `employees_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });
  }

  //this for pagination
  first = 0;
  rows = 4;
  pagedEmployees: Employee[] = [];
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedEmployees();
  }

  updatePagedEmployees() {
    const start = this.first;
    const end = start + this.rows;
    this.pagedEmployees = this.employees.slice(start, end);
  }

}
