import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { ProductService } from '../services/product.service';
import { StockService } from '../services/stock.service';
import { SidebarService } from '../services/sidebar.service';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    FloatLabelModule,
    ToolbarModule,
    TooltipModule,
    ProgressSpinnerModule,
    DropdownModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})

export class StockComponent {
  stocks: any[] = [];
  products: any[] = [];
  editingRow: any = null;
  clonedStocks: { [id: string]: any } = {};
  isDialogOpen: boolean = false;
  isSidebarOpen: boolean = true;
  isLoading = false;

  newStock = {
    product_id: null,
    quantity: null,
  };

  constructor(
    private stockService: StockService,
    private productService: ProductService,
    private messageService: MessageService,
    private sidebarService: SidebarService,
  ) {}

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
    this.fetchAllStocks();
    this.fetchAllProducts();
  }

  fetchAllStocks() {
    this.stockService.getAllStocks().subscribe({
      next: (data) => {
        this.stocks = data;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar estoques.' });
      },
    });
  }

  fetchAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map((product: any) => ({
          label: product.name,
          value: product.id
        }));
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar produtos.' });
      },
    });
  }

  onRowEditInit(stock: any) {
    this.clonedStocks[stock.id] = JSON.parse(JSON.stringify(stock));
    this.editingRow = { ...stock };
  }

  onRowEditCancel(stock: any, index: number) {
    const clonedStock = this.clonedStocks[stock.id];
    if (clonedStock) {
      Object.assign(stock, clonedStock);
      delete this.clonedStocks[stock.id];
    }
    this.editingRow = null;
  }

  onRowEditSave(stock: any) {
    const payload = {
      id: stock.id,
      product_id: stock.product_id,
      quantity: stock.quantity,
    };

    this.stockService.updateStock(payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estoque atualizado com sucesso!' });
        this.fetchAllStocks();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar estoque.' });
      },
    });
  }

  onDelete(stock: any) {
    if (confirm(`Tem certeza de que deseja excluir o estoque do produto ${stock.product?.name}?`)) {
      this.stockService.deleteStock(stock.id).subscribe({
        next: () => {
          this.stocks = this.stocks.filter((s) => s.id !== stock.id);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estoque excluído com sucesso!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir estoque.' });
        },
      });
    }
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.newStock = {
      product_id: null,
      quantity: null,
    };
  }

  createStock() {
    if (!this.validateStock(this.newStock)) {
      return;
    }

    const payload = {
      product_id: this.newStock.product_id,
      quantity: this.newStock.quantity,
    };

    this.closeDialog();
    this.isLoading = true;
    this.stockService.createStock(payload).subscribe({
      next: () => {
        this.fetchAllStocks();
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Estoque criado com sucesso!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar estoque.' });
        this.isLoading = true;
      },
    });
  }

  validateStock(stock: any): boolean {
    const messages: string[] = [];
  
    if (!stock.product_id) {
      messages.push('O campo "Produto" é obrigatório.');
    }
  
    if (stock.quantity === null || stock.quantity === undefined || stock.quantity < 0) {
      messages.push('O campo "Quantidade" é obrigatório e deve ser maior ou igual a zero.');
    }
  
    if (messages.length > 0) {
      messages.forEach((msg) => {
        this.messageService.add({ severity: 'info', summary: 'Campos Inválidos', detail: msg });
      });
      return false;
    }
  
    return true;
  }

  print() {
    const printContents = document.querySelector('.auth-container')?.innerHTML;
    const originalContents = document.body.innerHTML;
  
    if (printContents) {
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      console.error('Erro ao preparar a impressão.');
    }
  }
  
  exportToXLSX() {
    const tableData = this.stocks.map(stock => ({
      'Produto': stock.product?.name || 'N/A',
      'Quantidade': stock.quantity,
      'Última Atualização': stock.last_updated ? new Date(stock.last_updated).toLocaleDateString('pt-BR') + ' ' + new Date(stock.last_updated).toLocaleTimeString('pt-BR') : 'N/A',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Estoque');
  
    XLSX.writeFile(workbook, 'Estoque.xlsx');
  }

}
