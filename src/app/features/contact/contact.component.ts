import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LEAD_REPOSITORY } from '../../core/services/base.repository';
import { take } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private leadRepo = inject(LEAD_REPOSITORY);

  isSending = signal(false);
  isSuccess = signal(false);
  lastWhatsappUrl = '';

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
    email: ['', [Validators.required, Validators.email]],
    interest: [''],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
    // Check if query params contain service or product and pre-fill interest
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params['service']) {
        this.contactForm.patchValue({
          interest: `Servicio: ${params['service']}`,
          message: `Deseo solicitar una cotización formal y asesoramiento sobre el servicio de: ${params['service']}.`
        });
      } else if (params['product']) {
        this.contactForm.patchValue({
          interest: `Producto: ${params['product']}`,
          message: `Solicito cotización y disponibilidad del producto: ${params['product']}.`
        });
      }
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSending.set(true);
      
      const { name, phone, email, interest, message } = this.contactForm.value;
      const combinedMessage = interest ? `[Interés: ${interest}] - ${message}` : message;

      // Simulated network lag for conversion feel
      setTimeout(() => {
        this.leadRepo.addLead({
          name: name || '',
          phone: phone || '',
          email: email || '',
          message: combinedMessage || ''
        }).subscribe(() => {
          this.isSending.set(false);
          this.isSuccess.set(true);

          // Build WhatsApp message for instant response
          let waMessage = `*Hola LuxTraking, solicito una cotización:*\n\n`;
          waMessage += `👤 *Nombre:* ${name}\n`;
          waMessage += `📞 *Teléfono:* ${phone}\n`;
          waMessage += `✉️ *Email:* ${email}\n`;
          if (interest) {
            waMessage += `🎯 *Interés:* ${interest}\n`;
          }
          waMessage += `📝 *Mensaje:* ${message}`;

          this.lastWhatsappUrl = `https://api.whatsapp.com/send?phone=593992745312&text=${encodeURIComponent(waMessage)}`;
          window.open(this.lastWhatsappUrl, '_blank');
        });
      }, 1000);
    }
  }

  resetForm() {
    this.isSuccess.set(false);
    this.contactForm.reset();
  }
}
