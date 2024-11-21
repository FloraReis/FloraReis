import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InputTextModule ,FloatLabelModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}


  login() {

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';

      setTimeout(() => {
        this.errorMessage = '';
      }, 10000);

      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage = 'Credenciais inválidas.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);
      }
    );
  }

  navigateToPasswordReset() {
    this.router.navigate(['/password-reset']);
  }
}
