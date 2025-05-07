import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

import { Department } from '../../core/model/department';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    MatDialogModule,
    RouterLink
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './department-list.component.html',
})
export class DepartmentListComponent {
  private depSrv = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private confirm = inject(ConfirmationService);
  private toastr = inject(ToastrService);

  departments: Department[] = [];
  depId: number | null = null;

  ngOnInit() { this.load(); }

  load() {
    this.depSrv.list().subscribe(res => (this.departments = res));
  }

  openDialog(dep?: Department) {
    this.dialog.open(DepartmentDialogComponent, { data: dep ?? null, width: '400px' })
      .afterClosed()
      .subscribe(result => {
        if (!result) return;

        const action$ = result.id
          ? this.depSrv.update(result)
          : this.depSrv.create(result);

        action$.subscribe({
          next: saved => {
            this.toastr.success('تم الحفظ بنجاح');
            this.departments = result.id
              ? this.departments.map(d => d.id === saved.id ? saved : d)
              : [...this.departments, saved];
          },
          error: () => this.toastr.error('حدث خطأ أثناء الحفظ')
        });
      });
  }

  confirmDelete(dep?: Department) {

    this.confirm.confirm({
      message: `حذف القسم "${dep!.name}"؟`,
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.depSrv.delete(dep?.id!).subscribe(() => {
          this.toastr.success('تم الحذف بنجاح');
          this.load();
        });
      }
    });
  }
  
}
