import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LEAD_REPOSITORY } from '../../core/services/base.repository';
import { Lead } from '../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crm.component.html'
})
export class CrmComponent implements OnInit {
  private leadService = inject(LEAD_REPOSITORY);

  // States
  allLeads = signal<Lead[]>([]);
  selectedLead = signal<Lead | null>(null);
  
  // Filters
  searchQuery = signal('');
  activeStateFilter = signal('Todos');

  // New Note
  newNoteText = signal('');

  filteredLeads = computed(() => {
    let result = [...this.allLeads()];

    // Search query check
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      result = result.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.email.toLowerCase().includes(query) || 
        l.phone.includes(query)
      );
    }

    // State filter check
    const filter = this.activeStateFilter();
    if (filter !== 'Todos') {
      result = result.filter(l => l.status === filter);
    }

    return result;
  });

  ngOnInit() {
    this.loadLeads();
  }

  loadLeads() {
    this.leadService.getAllLeads().pipe(
      take(1)
    ).subscribe(data => {
      this.allLeads.set(data);
    });
  }

  selectLead(lead: Lead) {
    this.selectedLead.set(lead);
    this.newNoteText.set('');
  }

  updateStatus(id: string, event: any) {
    const newStatus = event.target.value as Lead['status'];
    this.leadService.updateLeadStatus(id, newStatus).subscribe(updatedLead => {
      this.loadLeads();
      if (this.selectedLead()?.id === id) {
        this.selectedLead.set(updatedLead);
      }
    });
  }

  appendNote(id: string, status: Lead['status']) {
    const noteText = this.newNoteText().trim();
    if (noteText) {
      this.leadService.updateLeadStatus(id, status, noteText).subscribe(updatedLead => {
        this.newNoteText.set('');
        this.loadLeads();
        this.selectedLead.set(updatedLead);
      });
    }
  }

  deleteLead(id: string) {
    if (confirm('¿Está seguro de eliminar este lead del CRM?')) {
      this.leadService.deleteLead(id).subscribe(() => {
        this.loadLeads();
        if (this.selectedLead()?.id === id) {
          this.selectedLead.set(null);
        }
      });
    }
  }
}
