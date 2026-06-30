import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(14px)' }),
        animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ContactSectionComponent implements OnInit, OnDestroy {
  @Input() contactForm: FormGroup | null = null;
  @Input() submitting = false;
  @Input() submitSuccess = false;
  @Input() submitError = '';
  @Input() onSubmit: (formData: unknown) => void = () => {};

  messageCharCount = 0;
  maxMessageLength = 500;
  private messageSubscription?: Subscription;

  contactInfo = {
    email: 'pedro.bicas14@gmail.com',
    phone: '+55 (11) 99358-5087',
    availability: 'Disponível para projetos selecionados'
  };

  ngOnInit(): void {
    if (!this.contactForm) return;

    const messageControl = this.contactForm.get('message');
    if (messageControl) {
      this.messageCharCount = (messageControl.value ?? '').length;
      this.messageSubscription = messageControl.valueChanges.subscribe(value => {
        this.messageCharCount = (value ?? '').length;
      });
    }
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }

  hasError(fieldName: string): boolean {
    const field = this.contactForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm?.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`;
    if (field.errors['email']) return 'Informe um email válido';
    if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} precisa ter mais caracteres`;
    if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} excede o limite permitido`;
    return 'Campo inválido';
  }

  onFormSubmit(): void {
    if (!this.contactForm) return;

    if (this.contactForm.valid) {
      this.onSubmit(this.contactForm.value);
      return;
    }

    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm?.get(key)?.markAsTouched();
    });
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Nome',
      email: 'Email',
      subject: 'Assunto',
      projectType: 'Tipo de projeto',
      message: 'Mensagem'
    };

    return labels[fieldName] ?? fieldName;
  }
}
