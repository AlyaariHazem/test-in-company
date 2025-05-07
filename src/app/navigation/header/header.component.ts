import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../login/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule 
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser;                // لعرض اسم المستخدم

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
