import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [CommonModule, UserDetailComponent, RouterLink],
  templateUrl: './user-detail-page.component.html',
  styleUrls: ['./user-detail-page.component.scss']
})
export class UserDetailPageComponent implements OnInit {
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
      const userId = +params['id'];
      this.loadUser(userId);
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

  goBack() {
    this.router.navigate(['/']);
  }

  deleteUser() {
    if (this.user && confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(this.user.id).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.error = 'Failed to delete user. Please try again later.';
          console.error('Error deleting user:', error);
        }
      });
    }
  }
} 