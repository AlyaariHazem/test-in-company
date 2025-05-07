import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,        // ⬅️ استبدل FormsModule
  FormBuilder,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,       // ⬅️ Reactive بدلاً من FormsModule
    MatFormFieldModule,
    MatInputModule,
    MatError
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  private fb = inject(FormBuilder);
  /** نموذج Reactive */
  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    pass:     ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  /** يُستدعى عند ngSubmit */
  login(): void {
    console.log('the form ', this.form.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const { username, pass } = this.form.value;
    this.auth.login(username!, pass!).subscribe({
      next: () => {
        this.toastr.success('تم تسجيل الدخول بنجاح');
        this.router.navigateByUrl('/employees');
      },
      error: () => {
        this.toastr.error('اسم المستخدم أو كلمة السر غير صحيحة');
      }
    });
  }
}
