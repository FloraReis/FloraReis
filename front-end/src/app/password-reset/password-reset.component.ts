import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputOtpModule } from 'primeng/inputotp';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FloatLabelModule, InputTextModule, InputOtpModule, 
  DialogModule, ProgressSpinnerModule, PasswordModule, DividerModule], 
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
  email: string  = '';
  code: string  = '';
  newPassword: string  = '';
  confirmPassword: string  = '';
  errorMessage: string  = '';
  successMessage: string  = '';
  isLoading: boolean = false;
  codeSent: boolean = false;
  passwordReset: boolean = false;

  constructor(private authService: AuthService,  private router: Router) {}

  requestCode() {

    if (this.email == '') {
      this.errorMessage = 'Insira um e-mail valido.'

      setTimeout(() => {
        this.errorMessage = '';
      }, 10000);
      
      return
    }

    this.isLoading = true;
    this.authService.requestResetCode(this.email).subscribe(
      () => {
        this.successMessage = 'Verifique o seu e-mail';
        this.isLoading = false;
        this.codeSent = true;

        setTimeout(() => {
          this.successMessage = '';
        }, 10000);
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Erro ao solicitar código.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 10000);

        this.isLoading = false;
      }
    );
  }

  validateCode() {
    if (this.code.length !== 6) {
      this.errorMessage = 'Código inválido.';

      setTimeout(() => {
        this.errorMessage = '';
      }, 10000);

      return;
    }

    this.errorMessage = '';
    this.isLoading = false;
    this.passwordReset = true;
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'As senhas não correspondem.';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.email, this.code, this.newPassword).subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Erro ao redefinir senha.';
      }
    );
  }
}
