import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promo-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-bar.component.html'
})
export class PromoBarComponent {
  isVisible = signal(true);

  close() {
    this.isVisible.set(false);
  }
}
