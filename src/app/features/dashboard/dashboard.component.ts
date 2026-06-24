import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDashboardService, DashboardMetrics } from '../../core/services/mock-dashboard.service';
import { MockLeadService } from '../../core/services/mock-lead.service';
import { Lead } from '../../shared/models/models';
import { take } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(MockDashboardService);
  private leadService = inject(MockLeadService);

  metrics = signal<DashboardMetrics | null>(null);
  recentLeads = signal<Lead[]>([]);

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.dashboardService.getMetrics().pipe(
      take(1)
    ).subscribe(data => this.metrics.set(data));

    // Get 5 recent leads sorted by id/date descending
    this.leadService.getAllLeads().pipe(
      take(1)
    ).subscribe(data => {
      this.recentLeads.set(data.slice(0, 5));
    });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }
}
