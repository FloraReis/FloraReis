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
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SidebarService } from '../services/sidebar.service';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';

import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-products',
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
    InputMaskModule,
    DropdownModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products: any[] = [];
  editingRow: any = null;
  clonedProducts: { [id: string]: any } = {};
  isDialogOpen: boolean = false;
  isSidebarOpen: boolean = true;
  isLoading: boolean = false;

  newProduct = {
    name: '',
    description: '',
    type: '',
    product_code: '',
    supplier_id: null,
  };

  suppliers: any[] = [];

  constructor(
    private sidebarService: SidebarService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
    this.fetchAllProducts();
    this.fetchAllSuppliers();
  }

  fetchAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar produtos:', err);
        this.isLoading = false;
      },
    });
  }

  fetchAllSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data.map((supplier: any) => ({
          label: supplier.company_name,
          value: supplier.id,
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar fornecedores:', err);
      },
    });
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id] = JSON.parse(JSON.stringify(product));
    this.editingRow = { ...product };
  }

  onRowEditCancel(product: any, index: number) {
    const clonedProduct = this.clonedProducts[product.id];

    if (clonedProduct) {
      Object.assign(product, clonedProduct);
      delete this.clonedProducts[product.id];
    }
    this.editingRow = null;
  }

  onRowEditSave(product: any) {
    const cleanPayload = {
      id: product.id,
      name: product.name,
      description: product.description,
      type: product.type,
      product_code: product.product_code,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock,
      supplier_id: product.supplier_id,
    };

    this.isLoading = true;
    this.productService.updateProduct(cleanPayload).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchAllProducts();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto atualizado com sucesso!' });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar produto!' });
      },
    });
  }

  onDelete(product: any) {
    if (confirm(`Tem certeza de que deseja excluir o produto ${product.name}?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== product.id);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto excluído com sucesso!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir produto!' });
        },
      });
    }
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.newProduct = {
      name: '',
      description: '',
      type: '',
      product_code: '',
      supplier_id: null,
    };
  }

  createProduct() {

    const productPayload = {
      name: this.newProduct.name,
      description: this.newProduct.description,
      type: this.newProduct.type,
      product_code: this.newProduct.product_code,
      supplier_id: this.newProduct.supplier_id,
    };

    this.closeDialog();
    this.isLoading = true;
    this.productService.createProduct(productPayload).subscribe({
      next: (response) => {
        this.fetchAllProducts();
        this.products.push(response);
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto criado com sucesso!' });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar produto!' });
      },
    });
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
    const tableData = this.products.map(product => ({
      Nome: product.name,
      Descrição: product.description || '',
      Tipo: product.type || '',
      Código: product.product_code || '',
      Preço: product.price.toFixed(2),
      Estoque: product.quantity_in_stock,
      Fornecedor: product.supplier?.company_name || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');

    XLSX.writeFile(workbook, 'Produtos.xlsx');
  }
}
