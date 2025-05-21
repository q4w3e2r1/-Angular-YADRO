import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users-list-page.component.html',
  styleUrls: ['./users-list-page.component.scss']
})
export class UsersListPageComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }
} 