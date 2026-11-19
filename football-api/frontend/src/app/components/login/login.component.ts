import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  authForm: FormGroup;
  isRegister = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authForm = this.fb.group({
      name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { name, email, password } = this.authForm.value;

    if (this.isRegister) {
      this.authService.register({ name: name || 'Usuario', email, password }).subscribe({
        next: () => this.router.navigate(['/players']),
        error: () => (this.errorMessage = 'Error al registrar usuario'),
      });
    } else {
      this.authService.login({ email, password }).subscribe({
        next: () => this.router.navigate(['/players']),
        error: () => (this.errorMessage = 'Credenciales inválidas'),
      });
    }
  }
}
