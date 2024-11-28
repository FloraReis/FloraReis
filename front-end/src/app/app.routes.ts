import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ProductsComponent } from './products/products.component';
import { PersonComponent } from './person/person.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { StockComponent } from './stock/stock.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
    { path: '', component: AppComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'person', component: PersonComponent },
    { path: 'suppliers', component: SuppliersComponent },
    { path: 'stock', component: StockComponent },
    { path: 'reports', component: ReportsComponent },
];
