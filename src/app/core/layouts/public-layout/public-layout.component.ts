import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { WhatsAppFloatComponent } from '../../../shared/components/whatsapp-float/whatsapp-float.component';
import { PromoBarComponent } from '../../../shared/components/promo-bar/promo-bar.component';
import { ExitPopupComponent } from '../../../shared/components/exit-popup/exit-popup.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    NavbarComponent, 
    FooterComponent, 
    WhatsAppFloatComponent, 
    PromoBarComponent,
    ExitPopupComponent
  ],
  templateUrl: './public-layout.component.html'
})
export class PublicLayoutComponent {}
