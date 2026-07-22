import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LEAD_REPOSITORY } from '../../../core/services/base.repository';

@Component({
  selector: 'app-exit-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './exit-popup.component.html'
})
export class ExitPopupComponent {
  private fb = inject(FormBuilder);
  private leadRepository = inject(LEAD_REPOSITORY);

  isVisible = signal(false);
  hasBeenClosed = signal(false);
  isSuccess = signal(false);

  exitForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]]
  });

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    // Check if user has already seen or closed the popup in this session
    const hasSeen = sessionStorage.getItem('hasSeenExitPopup');
    if (!hasSeen && event.clientY < 50) {
      this.isVisible.set(true);
      sessionStorage.setItem('hasSeenExitPopup', 'true');
    }
  }

  closePopup() {
    this.isVisible.set(false);
    this.hasBeenClosed.set(true);
  }

  onSubmit() {
    if (this.exitForm.valid) {
      const { name, phone } = this.exitForm.value;
      this.leadRepository.addLead({
        name: name || '',
        phone: phone || '',
        email: 'interesado@diagnostico.com',
        message: 'SOLICITUD DE DIAGNÓSTICO GRATUITO (Captura por Exit Intent Popup).'
      }).subscribe(() => {
        this.isSuccess.set(true);

        let waMessage = `*Hola LuxTraking, solicito Diagnóstico Gratuito / Cotización:*\n\n`;
        waMessage += `👤 *Nombre:* ${name}\n`;
        waMessage += `📞 *Teléfono:* ${phone}`;

        const url = `https://api.whatsapp.com/send?phone=593992745312&text=${encodeURIComponent(waMessage)}`;
        window.open(url, '_blank');

        setTimeout(() => {
          this.closePopup();
        }, 2500);
      });
    }
  }
}
