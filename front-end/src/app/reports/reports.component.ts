import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import * as XLSX from 'xlsx';

import { StockService } from '../services/stock.service';
import { ProductService } from '../services/product.service';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputMaskModule,
    FloatLabelModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})

export class ReportsComponent {
  stockDate: string | null = null;
  productDate: string | null = null;
  isSidebarOpen: boolean = true;

  constructor(
    private sidebarService: SidebarService,
    private stockService: StockService,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
  }

  generateStockReport() {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.exportToExcel(data, 'relatorio_estoque');
        this.showToast('success', 'Relatório de Estoque', 'Relatório gerado com sucesso!');
      },
      error: () => {
        this.showToast('error', 'Erro', 'Erro ao gerar o relatório de estoque.');
      },
    });
  }

  generateProductReport() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.exportToExcel(data, 'relatorio_produtos');
        this.showToast('success', 'Relatório de Produtos', 'Relatório gerado com sucesso!');
      },
      error: () => {
        this.showToast('error', 'Erro', 'Erro ao gerar o relatório de produtos.');
      },
    });
  }

  exportToExcel(data: any[], fileName: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  showToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }

}
