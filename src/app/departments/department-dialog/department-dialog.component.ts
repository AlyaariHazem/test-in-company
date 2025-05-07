import { Component, inject } from '@angular/core';
import {
  MatDialogRef, MAT_DIALOG_DATA, MatDialogModule
} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Department } from '../../core/model/department';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dep-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './department-dialog.component.html',
  styles: [`.w-100{width:100%}`]
})
export class DepartmentDialogComponent {
  private fb = inject(FormBuilder);
  dialog = inject(MatDialogRef<DepartmentDialogComponent>);
  data = inject<Department | null>(MAT_DIALOG_DATA);

  form: FormGroup<{
    id: FormControl<number | null>;
    name: FormControl<string>;
    description: FormControl<string>;
  }> = this.fb.group({
    id: new FormControl<number | null>(null),
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true })
  });

  ngOnInit() {
    if (this.data) {
      this.form.patchValue({
        id: this.data.id ?? null,
        name: this.data.name,
        description: this.data.description
      });
    }
  }


  // department-dialog.component.ts
  save() {
    if (this.form.invalid) return;

    const value = this.form.value;
    if (value.id == null) delete (value as any).id;
    this.dialog.close(value);
  }

}
