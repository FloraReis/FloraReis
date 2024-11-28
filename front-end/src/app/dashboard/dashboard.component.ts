import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DataViewModule } from 'primeng/dataview';
import { MeterGroupModule } from 'primeng/metergroup';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService,MessageService } from 'primeng/api';

import { SidebarService } from '../services/sidebar.service';
import { OrderService } from '../services/order.service';
import { PersonService } from '../services/person.service';
import { ProductService } from '../services/product.service';
import { HttpClient } from '@angular/common/http';

import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
    FormsModule, 
    RouterModule, 
    DataViewModule, 
    MeterGroupModule, 
    ButtonModule, 
    CardModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputMaskModule,
    ToastModule,
    CalendarModule,
    FloatLabelModule,
    ConfirmDialogModule],
  providers: [MessageService,ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  isSidebarOpen: boolean = true;
  createDialogVisible: boolean = false;
  filterDialogVisible: boolean = false;
  confirmDialogVisible: boolean = false;
  selectedOrder: any = null;
  search_start_date: any = '';
  expandedOrder: any = null;
  orders: any[] = [];
  meterItems: any[] = [];

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
  
  persons: any[] = [];
  products: any[] = [];

  dailyOrdersPercentage = 0;
  weeklyOrdersPercentage = 0;
  monthlyOrdersPercentage = 0;

  constructor(
    private sidebarService: SidebarService,
    private orderService: OrderService,
    private personService: PersonService,
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.sidebarService.isSidebarOpen$.subscribe(
      (state) => (this.isSidebarOpen = state)
    );
    this.fetchOrders();
    this.fetchPerson();
    this.fetchProducts();
  }

  fetchOrders() {
    const today = new Date();
    const formattedDate = moment(today, 'DD/MM/YYYY').format('YYYY-MM-DD');

    this.orderService.getAllOrders({delivery_date: formattedDate}).subscribe({
      next: (data) => {
        this.orders = data;
        this.calculateOrderMetrics();
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos:', err);
      },
    });
  }

  fetchProducts() {
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

  fetchPerson() {
    this.personService.getAllPersons().subscribe({
      next: (data) => {
        this.persons = data.map((person: any) => ({
          label: person.full_name,
          value: person.id,
        }));
      },
    });
  }

  calculateOrderMetrics() {
    const today = moment().startOf('day');

    const dailyOrders = this.orders.filter((order) => {
      const deliveryDate = moment(order.delivery_date, 'YYYY-MM-DD').startOf('day');
      return order.status === 'C' && deliveryDate.isSame(today);
    });
  
    const weeklyOrders = this.orders.filter((order) => {
      const deliveryDate = moment(order.delivery_date, 'YYYY-MM-DD').startOf('day');
      const weekAgo = today.clone().subtract(7, 'days');
      return order.status === 'C' && deliveryDate.isBetween(weekAgo, today, undefined, '[]');
    });
  
    const monthlyOrders = this.orders.filter((order) => {
      const deliveryDate = moment(order.delivery_date, 'YYYY-MM-DD').startOf('day');
      const monthAgo = today.clone().subtract(30, 'days');
      return order.status === 'C' && deliveryDate.isBetween(monthAgo, today, undefined, '[]');
    });

    this.meterItems = [
      {
        label: 'Pedidos Diários',
        color1: '#34d399',
        color2: '#6ee7b7',
        value: (dailyOrders.length / this.orders.length) * 100 || 0,
        icon: 'pi pi-calendar-clock',
      },
      {
        label: 'Pedidos Semanais',
        color1: '#fbbf24',
        color2: '#fde68a',
        value: (weeklyOrders.length / this.orders.length) * 100 || 0,
        icon: 'pi pi-calendar-clock',
      },
      {
        label: 'Pedidos Mensais',
        color1: '#7b0339',
        color2: '#7b0339',
        value: (monthlyOrders.length / this.orders.length) * 100 || 0,
        icon: 'pi pi-calendar-clock',
      },
    ];

  }

  showOrderDetails(order: any) {
    this.expandedOrder = this.expandedOrder === order ? null : order;
  }

  openCreateDialog() {
    this.createDialogVisible = true;
  }
  
  closeCreateDialog() {
    this.createDialogVisible = false;
    this.resetOrderForm();
  }

  resetOrderForm() {
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

  createOrder() {

    const orderPayload = {
      person_id: this.newOrder.person_id,
      delivery_date: moment(this.newOrder.delivery_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      status: this.newOrder.status,
      total_amount: this.newOrder.total_amount,
      delivery_address: {
        logradouro: this.newOrder.delivery_address.logradouro,
        bairro: this.newOrder.delivery_address.bairro,
        cidade: this.newOrder.delivery_address.cidade,
        estado: this.newOrder.delivery_address.estado,
        cep: this.newOrder.delivery_address.cep,
        numero: this.newOrder.delivery_address.numero,
        complemento: this.newOrder.delivery_address.complemento,
      },
      items: this.newOrder.items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_per_unit: item.price_per_unit,
      })),
    };

  
    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        this.fetchOrders();
        this.closeCreateDialog();
        this.messageService.add({severity: 'success',summary: 'Sucesso',detail: 'Pedido criado com sucesso!',});
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar pedido. Tente novamente.'});
      },
    });
  }

  openFilterDialog() {
    this.filterDialogVisible = true;
  }
  
  closeFilterDialog() {
    this.filterDialogVisible = false;
  }
  
  filterOrdersByDate() {
    if (!this.search_start_date) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Erro ao criar pedido. Tente novamente.'});
      return;
    }
  
    const formattedDate = moment(this.search_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.orderService.getAllOrders({ search_start_date: formattedDate }).subscribe({
      next: (data) => {
        this.orders = data;
        this.closeFilterDialog();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar pedido. Tente novamente.'});
      },
    });
  }
  
  addItem() {
    this.newOrder.items.push({
      product_id: null,
      quantity: null,
      price_per_unit: null,
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

  searchAddress() {
    const cep = this.newOrder.delivery_address.cep.replace('-', '');

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: (data) => {
        if (data.erro) {
          alert('CEP não encontrado!');
          return;
        }
        this.newOrder.delivery_address.logradouro = data.logradouro || '';
        this.newOrder.delivery_address.bairro = data.bairro || '';
        this.newOrder.delivery_address.cidade = data.localidade || '';
        this.newOrder.delivery_address.estado = data.uf || '';
      },
      error: (err) => {
        console.error('Erro ao buscar o endereço:', err);
      }
    });
  }

  confirmConcludeOrder(order: any) {
    this.confirmationService.confirm({
      message: 'Você irá concluir a entrega do pedido. Você tem certeza dessa ação?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.concludeOrder(order);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Ação cancelada.',
        });
      },
    });
  }

  cancelConcludeOrder() {
    this.confirmDialogVisible = false;
    this.selectedOrder = null;
  }

  concludeOrder(order: any) {

      const updatedOrder = {
        id: order.id,
        status: 'C',
      };

      this.orderService.updateOrder(updatedOrder).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Pedido atualizado com sucesso!',
          });
          this.fetchOrders();
          this.cancelConcludeOrder();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao concluir a entrega do pedido!',
          });
        },
      });
    }

}
