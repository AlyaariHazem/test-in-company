import { Routes } from '@angular/router';
import { FormComponent } from './login/form/form.component';
import { authGuard } from './login/auth.guard';
import { NavigationComponent } from './navigation/navigation.component';
import { DepartmentListComponent } from './departments/department-list/department-list.component';

export const routes: Routes = [
    { path: 'login', component: FormComponent },

    {
        path: '',
        component: NavigationComponent,
        canActivateChild: [authGuard],
        children: [
            { path: '', redirectTo: 'employees', pathMatch: 'full' },

            {
                path: 'employees',
                loadComponent: () =>
                    import('./employees/list/list.component').then(m => m.ListComponent),
            },
            {
                path: 'departments',
                component: DepartmentListComponent,
            },
            {
                path: 'departments/:id/employees',
                loadComponent: () =>
                    import('./employees/list/list.component').then(m => m.ListComponent),
            },
        ],
    },

    { path: '**', redirectTo: 'login' },
];
