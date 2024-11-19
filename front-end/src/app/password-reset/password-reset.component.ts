import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  step = 1;
  email = '';
  code = '';
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService,  private router: Router) {}

  requestCode() {

    if (this.email == '') {
      this.errorMessage = 'Insira um e-mail valido.'
    } else {
      this.authService.requestResetCode(this.email).subscribe(
        () => {
          this.successMessage = 'Código enviado para o e-mail.';
          this.errorMessage = '';
          this.step = 2;
        },
        (error) => {
          this.errorMessage = error.error?.message || 'Erro ao solicitar código.';
          this.successMessage = '';
        }
      );
    }
  }

  validateCode() {
    if (this.code.length !== 6) {
      this.errorMessage = 'Código inválido.';
      return;
    }
    this.errorMessage = '';
    this.successMessage = '';
    this.step = 3;
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'As senhas não correspondem.';
      return;
    }

    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe(
      () => {
        this.successMessage = 'Senha redefinida com sucesso.';
        this.errorMessage = '';
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Erro ao redefinir senha.';
        this.successMessage = '';
      }
    );
  }
}
