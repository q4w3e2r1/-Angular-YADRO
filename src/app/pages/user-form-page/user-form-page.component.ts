import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { User } from '../../models/user.model';
import { MOCK_USERS } from '../../data/mock-users';

@Component({
  selector: 'app-user-form-page',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  template: `
    <div class="page-container">
      <app-user-form [user]="user"></app-user-form>
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.user = MOCK_USERS.find(user => user.id === +userId) || null;
      }
    });
  }
} 