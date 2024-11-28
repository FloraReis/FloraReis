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
import { SupplierService } from '../services/supplier.service';

import { HttpClient } from '@angular/common/http';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-suppliers',
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
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss'
})
export class SuppliersComponent {

  suppliers: any[] = [];
  editingRow: any = null;
  clonedSuppliers: { [id: string]: any } = {};
  isDialogOpen: boolean = false;
  isSidebarOpen: boolean = true;
  showAddressFields: boolean = false;
  isLoading = false;

  newSupplier = {
    company_name: '',
    type_company: '',
    cnpj_cpf: '',
    email: '',
    contact: '',
    contact_type: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: '',
  };

  documentTypes = [
    { label: 'CPF', value: 'CPF' },
    { label: 'CNPJ', value: 'CNPJ' }
  ];

  selectedDocumentType: string = '';
  documentMask: string = '999.999.999-99';

  constructor(
    private sidebarService: SidebarService,
    private supplierService: SupplierService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
    this.fetchAllSuppliers();
  }

  fetchAllSuppliers() {
    this.isLoading = true;
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pessoas:', err);
        this.isLoading = false;
      },
    });
  }

  onRowEditInit(supplier: any) {
    this.clonedSuppliers[supplier.id] = JSON.parse(JSON.stringify(supplier));
    this.editingRow = { ...supplier };
  }

  onRowEditCancel(supplier: any, index: number) {
    const clonedSupplier = this.clonedSuppliers[supplier.id];

    if (clonedSupplier) {
      Object.assign(supplier, clonedSupplier);
      delete this.clonedSuppliers[supplier.id];
    }
    this.editingRow = null;
  }

  onRowEditSave(supplier: any) {
    const cleanPayload = {
      id: supplier.id,
      company_name: supplier.company_name,
      email: supplier.email,
      type_company: supplier.type_company,
      cnpj_cpf: supplier.cnpj_cpf,
      contact: supplier.contact,
      contact_type: supplier.contact_type,
      address: {
        logradouro: supplier.address?.logradouro,
        numero: supplier.address?.numero,
        bairro: supplier.address?.bairro,
        cidade: supplier.address?.cidade,
        estado: supplier.address?.estado,
        cep: supplier.address?.cep,
        complemento: supplier.address?.complemento,
      },
    };

    this.isLoading = true;
    this.supplierService.updateSupplier(cleanPayload).subscribe({
      next: () => {
        this.isLoading = false;
        this,this.fetchAllSuppliers();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dados editados com sucesso!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar dados.' });
      },
    });
  }

  onDelete(supplier: any) {
    if (confirm(`Tem certeza de que deseja excluir ${supplier.company_name}?`)) {
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next: () => {
          this.suppliers = this.suppliers.filter((s) => s.id !== supplier.id);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor excluída com sucesso!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir cadastro do fornecedor!' });
        },
      });
    }
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.newSupplier = {
      company_name: '',
      type_company: '',
      cnpj_cpf: '',
      email: '',
      contact: '',
      contact_type: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      complemento: '',
    };
  }

  createSupplier() {

    if (!this.validateSupplier(this.newSupplier)) {
      return;
    }

    const supplierPayload = {
      company_name: this.newSupplier.company_name,
      email: this.newSupplier.email,
      type_company: this.newSupplier.type_company,
      cnpj_cpf: this.newSupplier.cnpj_cpf,
      contact: this.newSupplier.contact,
      contact_type: this.newSupplier.contact_type,
      address: {
        logradouro: this.newSupplier.logradouro,
        numero: this.newSupplier.numero,
        bairro: this.newSupplier.bairro,
        cidade: this.newSupplier.cidade,
        estado: this.newSupplier.estado,
        cep: this.newSupplier.cep,
        complemento: this.newSupplier.complemento,
      },
    };

    this.closeDialog();
    this.isLoading = true;
    this.supplierService.createSupplier(supplierPayload).subscribe({
      next: (response) => {
        this.fetchAllSuppliers();
        this.suppliers.push(response);
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor criado com sucesso!' });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar fornecedor!' });
      },
    });
  }

  validateSupplier(supplier: any): boolean {
    const messages: string[] = [];
  
    if ((!supplier.company_name || supplier.company_name.length > 100) && supplier.numero.length <= 0) {
      messages.push('O campo "Nome da empresa" é obrigatório e deve ter no máximo 100 caracteres.');
    }
  
    if ((!supplier.type_company || supplier.type_company.length > 50) && supplier.numero.length <= 0) {
      messages.push('O campo "Tipo de empresa" é obrigatório e deve ter no máximo 50 caracteres.');
    }
  
    const cnpjCpfRegex = /^\d{2,3}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!supplier.cnpj_cpf || !cnpjCpfRegex.test(supplier.cnpj_cpf) && supplier.numero.length <= 0) {
      messages.push('O campo "CPF/CNPJ" é obrigatório e deve estar no formato válido.');
    }
  
    if ((supplier.contact && supplier.contact.length > 50) && supplier.numero.length <= 0) {
      messages.push('O campo "Contato" não pode ultrapassar 50 caracteres.');
    }
  
    if ((!supplier.contact_type || supplier.contact_type.length > 50) && supplier.numero.length <= 0) {
      messages.push('O campo "Tipo de contato" é obrigatório e deve ter no máximo 50 caracteres.');
    }
  
      if (!supplier.logradouro && supplier.numero.length <= 0) {
        messages.push('O campo "Logradouro" é obrigatório.');
      }
      if (!supplier.numero && supplier.numero.length <= 0) {
        messages.push('O campo "Número" é obrigatório.');
      }
      if (!supplier.bairro && supplier.numero.length <= 0) {
        messages.push('O campo "Bairro" é obrigatório.');
      }
      if (!supplier.cidade && supplier.numero.length <= 0) {
        messages.push('O campo "Cidade" é obrigatório.');
      }
      if (!supplier.estado && supplier.numero.length <= 0) {
        messages.push('O campo "Estado" é obrigatório.');
      }
  
      const cepRegex = /^\d{5}-\d{3}$/;
      if ((!supplier.cep || !cepRegex.test(supplier.cep)) && supplier.numero.length <= 0) {
        messages.push('O campo "CEP" é obrigatório e deve estar no formato 00000-000.');
      }
  
    if (messages.length > 0) {
      messages.forEach((msg) => {
        this.messageService.add({ severity: 'info', summary: 'Campos inválidos', detail: msg });
      });
      return false;
    }
  
    return true;
  }
  
  updateDocumentMask() {
    if (this.selectedDocumentType === 'CPF') {
      this.documentMask = '999.999.999-99';
    } else if (this.selectedDocumentType === 'CNPJ') {
      this.documentMask = '99.999.999/9999-99';
    }
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
    const tableData = this.suppliers.map(supplier => ({
      'Nome da empresa': supplier.company_name,
      Tipo: supplier.type_company,
      'CPF/CNPJ': supplier.cnpj_cpf,
      Email: supplier.email,
      Telefone: supplier.contact,
      'Tipo de contato': supplier.contact_type,
      Logradouro: supplier.address?.logradouro || '',
      Número: supplier.address?.numero || '',
      Bairro: supplier.address?.bairro || '',
      Cidade: supplier.address?.cidade || '',
      Estado: supplier.address?.estado || '',
      CEP: supplier.address?.cep || '',
      Complemento: supplier.address?.complemento || '',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Fornecedores');

    XLSX.writeFile(workbook, 'Fornecedores.xlsx');
  }

  toggleAddressVisibility() {
    this.showAddressFields = !this.showAddressFields;
  }

  searchAddress() {
    if (!this.newSupplier.cep || this.newSupplier.cep.length < 8) return;

    const cep = this.newSupplier.cep.replace('-', '');

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (data.erro) {
          alert('CEP não encontrado!');
          return;
        }
        this.newSupplier.logradouro = data.logradouro || '';
        this.newSupplier.bairro = data.bairro || '';
        this.newSupplier.cidade = data.localidade || '';
        this.newSupplier.estado = data.uf || '';
      },
      error: (err) => {
        console.error('Erro ao buscar o endereço:', err);
      }
    });
  }
}
