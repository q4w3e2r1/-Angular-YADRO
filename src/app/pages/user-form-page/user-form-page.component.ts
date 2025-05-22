import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [CommonModule, UserFormComponent, NzSpinModule, NzAlertModule],
  template: `
    <div class="page-container">
      <nz-spin [nzSpinning]="loading">
        <nz-alert
          *ngIf="error"
          nzType="error"
          nzMessage="Error"
          [nzDescription]="error"
          nzShowIcon>
        </nz-alert>

        <app-user-form *ngIf="!loading && !error" [user]="user"></app-user-form>
      </nz-spin>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
  `]
})
export class UserFormPageComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(+userId);
      } else {
        this.loading = false;
      }
    });
  }

  private loadUser(id: number) {
    this.loading = true;
    this.error = null;

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load user details. Please try again later.';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }
} 