import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';

import { MessageService } from 'primeng/api';

import { OrderService } from '../services/order.service';
import { PersonService } from '../services/person.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    ToastModule,
    CalendarModule,
    FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})

export class OrdersComponent {
  isDialogOpen = false;

  newOrder: any = {
    person_id: null,
    delivery_date: null,
    status: 'P',
    total_amount: 0,
    delivery_address: {
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      numero: '',
      complemento: '',
    },
    items: [],
  };

  person: any[] = [];
  products: any[] = [];

  constructor(
    private orderService: OrderService,
    private personService: PersonService,
    private productService: ProductService,
    private messageService: MessageService) {
  }

  ngOnInit() {
    this.fetchProducts();
    this.fetchPerson();
  }

  fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map((product: any) => ({
          label: product.name,
          value: product.id,
        }));
      },
    });
  }

  fetchPerson() {
    this.personService.getAllPersons().subscribe({
      next: (data) => {
        this.person = data.map((person: any) => ({
          label: person.name,
          value: person.id,
        }));
      },
    });
  }

  addItem() {
    this.newOrder.items.push({
      product_id: null,
      quantity: 1,
      price_per_unit: 0,
      total_price: 0,
    });
  }

  removeItem(index: number) {
    this.newOrder.items.splice(index, 1);
  }

  calculateTotal() {
    this.newOrder.total_amount = this.newOrder.items.reduce((sum: number, item: { quantity: number; price_per_unit: number }) => {
      return sum + item.quantity * item.price_per_unit;
    }, 0);
  }

  createOrder() {
    this.orderService.createOrder(this.newOrder).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido criado com sucesso!' });
        this.closeDialog();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar pedido!' });
      },
    });
  }

  openDialog() {
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
    this.resetForm();
  }

  resetForm() {
    this.newOrder = {
      person_id: null,
      delivery_date: null,
      status: 'P',
      total_amount: 0,
      delivery_address: {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        numero: '',
        complemento: '',
      },
      items: [],
    };
  }

}