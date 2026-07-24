import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-float.component.html'
})
export class WhatsAppFloatComponent implements OnInit {
  isChatOpen = signal(false);
  showTooltip = signal(false);
  whatsappUrl = 'https://api.whatsapp.com/send?phone=593991691654&text=Hola%20LuxTraking,%20solicito%20información%20y%20una%20cotización%20sobre%20sus%20sistemas%20de%20seguridad.';

  ngOnInit() {
    // Show the initial tooltip after 5 seconds to prompt engagement
    setTimeout(() => {
      this.showTooltip.set(true);
    }, 5000);
  }

  toggleChat() {
    this.isChatOpen.update(val => !val);
    if (this.isChatOpen()) {
      this.showTooltip.set(false);
    }
  }
}
