import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AvatarModule } from 'primeng/avatar';

import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AvatarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isSidebarOpen = true;
  loggedInUser = 'Usuário';

  menuItems = [
    { label: 'Pessoas', icon: 'pi pi-user', route: '/person' },
    { label: 'Fornecedores', icon: 'pi pi-users', route: '/suppliers' },
    { label: 'Produtos', icon: 'pi pi-shopping-cart', route: '/products' },
    { label: 'Estoque', icon: 'pi pi-box', route: '/stock' },
  ];

  homeItems = [
    { label: 'Dashboard', icon: 'pi pi-warehouse', route: '/dashboard'}
  ];

  reportsItems = [
    { label: 'Relatorios', icon: 'pi pi-chart-line', route: '/reports'}
  ];

  constructor(private router: Router, private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    console.log('Deslogar');
    this.router.navigate(['/login']);
  }

}
