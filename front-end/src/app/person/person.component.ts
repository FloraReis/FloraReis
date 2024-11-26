import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SidebarService } from '../services/sidebar.service';
import { PersonService } from '../services/person.service';

import { HttpClient } from '@angular/common/http';

import moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule, TableModule, DialogModule, InputTextModule, ButtonModule, ReactiveFormsModule,
    FormsModule, FloatLabelModule, TooltipModule, ProgressSpinnerModule,
    InputMaskModule, DropdownModule, ToastModule,],
  providers: [MessageService],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})

export class PersonComponent {

  people: any[] = [];
  editingRow: any = null;
  clonedPeople: { [id: string]: any } = {};
  isDialogOpen: boolean = false;
  isSidebarOpen: boolean = true;
  showAddressFields: boolean = false;
  isLoading = false;
  newPerson = {
    full_name: '',
    email: '',
    phone: '',
    cpf: '',
    birth_date: '',
    realm: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    complemento: ''
  };

  types = [
    { label: 'Cliente', value: 'C' },
    { label: 'Funcionário', value: 'F' }
  ];

  constructor(
    private sidebarService: SidebarService,
    private personService: PersonService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
    this.fetchAllPersons();
  }

  fetchAllPersons() {
    this.personService.getAllPersons().subscribe({
      next: (data) => {
        this.people = data;
      },
      error: (err) => {
        console.error('Erro ao buscar pessoas:', err);
      },
    });
  }

  onRowEditInit(person: any) {
    this.clonedPeople[person.id] = JSON.parse(JSON.stringify(person));
    this.editingRow = { ...person };
  }

  onRowEditCancel(person: any, index: number) {
    const clonedPerson = this.clonedPeople[person.id];

    if (clonedPerson) {
      Object.assign(person, clonedPerson);
      delete this.clonedPeople[person.id];
    }
    this.editingRow = null;
  }

  onRowEditSave(person: any) {

    const cleanPayload = {
      id: person.id,
      full_name: person.full_name,
      email: person.email,
      phone: person.phone,
      cpf: person.cpf,
      birth_date: person.birth_date,
      realm: person.realm,
      address: {
        logradouro: person.address?.logradouro,
        numero: person.address?.numero,
        bairro: person.address?.bairro,
        cidade: person.address?.cidade,
        estado: person.address?.estado,
        cep: person.address?.cep,
        complemento: person.address?.complemento,
      },
    };

    this.isLoading = true;
    this.personService.updatePerson(cleanPayload).subscribe({
      next: () => {
        this.isLoading = false;
        this.fetchAllPersons();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Dados editados com sucesso!' });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao editar dados.' });
      },
    });
  }

  onDelete(person: any) {
    if (confirm(`Tem certeza de que deseja excluir ${person.full_name}?`)) {
      this.personService.deletePerson(person.id).subscribe({
        next: () => {
          this.people = this.people.filter((p) => p.id !== person.id);
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa excluída com sucesso!' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir cadastro da pessoa!' });
        },
      });
    }
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.newPerson = {
      full_name: '',
      email: '',
      phone: '',
      cpf: '',
      birth_date: '',
      realm: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      complemento: ''
    };
  }

  createPerson() {

    if (!this.validatePerson(this.newPerson)) {
      return;
    }

    const personPayload = {
      full_name: this.newPerson.full_name,
      email: this.newPerson.email,
      phone: this.newPerson.phone,
      cpf: this.newPerson.cpf,
      birth_date: moment(this.newPerson.birth_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      realm: this.newPerson.realm,
      address: {
        logradouro: this.newPerson.logradouro,
        numero: this.newPerson.numero,
        bairro: this.newPerson.bairro,
        cep: this.newPerson.cep,
        cidade: this.newPerson.cidade,
        estado: this.newPerson.estado,
        complemento: this.newPerson.complemento,
      },
    };

    this.closeDialog();
    this.isLoading = true;
    this.personService.createPerson(personPayload).subscribe({
      next: (response) => {
        this.fetchAllPersons();
        this.people.push(response);
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pessoa criada com sucesso!' });
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar pessoa!' });
      },
    });
  }

  validatePerson(person: any): boolean {
    const messages: string[] = [];

    if ((!person.full_name || person.full_name.length > 150) && person.full_name.length <= 0) {
      messages.push('O campo "Nome" é obrigatório e deve ter no máximo 150 caracteres.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if ((!person.email || !emailRegex.test(person.email)) && person.email.length <= 0) {
      messages.push('O campo "Email" é obrigatório e deve ser um endereço válido.');
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if ((!person.cpf || !cpfRegex.test(person.cpf)) && person.cpf.length <= 0) {
      messages.push('O campo "CPF" é obrigatório e deve estar no formato 000.000.000-00.');
    }

    if (person.phone && person.phone.length > 15 && person.phone.length <= 0) {
      messages.push('O campo "Telefone" não pode ultrapassar 15 caracteres.');
    }

    if (!person.birth_date && person.birth_date.length <= 0) {
      messages.push('O campo "Data de Nascimento" é obrigatório.');
    }

    if (!person.realm && person.numero.length <= 0) {
      messages.push('O campo "Tipo" é obrigatório e deve ser "Cliente" ou "Funcionário".');
    }

    if (!person.logradouro && person.longradouro.length <= 0) {
      messages.push('O campo "Logradouro" é obrigatório.');
    }
    if (!person.numero && person.numero.length <= 0) {
      messages.push('O campo "Número" é obrigatório.');
    }
    if (!person.bairro && person.bairro.length <= 0) {
      messages.push('O campo "Bairro" é obrigatório.');
    }
    if (!person.cidade && person.cidade.length <= 0) {
      messages.push('O campo "Cidade" é obrigatório.');
    }
    if (!person.estado && person.estado.length <= 0) {
      messages.push('O campo "Estado" é obrigatório.');
    }

    const cepRegex = /^\d{5}-\d{3}$/;
    if ((!person.cep || !cepRegex.test(person.cep)) && person.cep.length <= 0) {
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
    const tableData = this.people.map(person => ({
      Nome: person.full_name,
      Email: person.email,
      Telefone: person.phone,
      CPF: person.cpf,
      'Data de Nascimento': person.birth_date ? new Date(person.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '' ,
      Tipo: person.realm === 'C' ? 'Cliente' : 'Funcionário',
      Logradouro: person.address?.logradouro || '',
      Número: person.address?.numero || '',
      Bairro: person.address?.bairro || '',
      Cidade: person.address?.cidade || '',
      Estado: person.address?.estado || '',
      CEP: person.address?.cep || '',
      Complemento: person.address?.complemento || '',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pessoas');

    XLSX.writeFile(workbook, 'Pessoas.xlsx');
  }

  toggleAddressVisibility() {
    this.showAddressFields = !this.showAddressFields;
  }

  searchAddress() {
    if (!this.newPerson.cep || this.newPerson.cep.length < 8) return;

    const cep = this.newPerson.cep.replace('-', '');

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (data.erro) {
          alert('CEP não encontrado!');
          return;
        }
        this.newPerson.logradouro = data.logradouro || '';
        this.newPerson.bairro = data.bairro || '';
        this.newPerson.cidade = data.localidade || '';
        this.newPerson.estado = data.uf || '';
      },
      error: (err) => {
        console.error('Erro ao buscar o endereço:', err);
      }
    });
  }
}
