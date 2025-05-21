import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  @Input() user: User | null = null;
  userForm!: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isEditMode = !!this.user;
    this.initForm();
  }

  private initForm() {
    this.userForm = this.fb.group({
      name: [this.user?.name || '', [Validators.required]],
      username: [this.user?.username || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      phone: [this.user?.phone || ''],
      website: [this.user?.website || ''],
      address: this.fb.group({
        street: [this.user?.address.street || '', [Validators.required]],
        suite: [this.user?.address.suite || ''],
        city: [this.user?.address.city || '', [Validators.required]],
        zipcode: [this.user?.address.zipcode || '', [Validators.required]],
        geo: this.fb.group({
          lat: [this.user?.address.geo.lat || ''],
          lng: [this.user?.address.geo.lng || '']
        })
      }),
      company: this.fb.group({
        name: [this.user?.company.name || '', [Validators.required]],
        catchPhrase: [this.user?.company.catchPhrase || ''],
        bs: [this.user?.company.bs || '']
      })
    });
  }

  isFieldInvalid(fieldPath: string): boolean {
    const field = this.userForm.get(fieldPath);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getEmailErrorMessage(): string {
    const emailControl = this.userForm.get('email');
    if (emailControl?.errors?.['required']) {
      return 'Email is required';
    }
    if (emailControl?.errors?.['email']) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      this.error = null;
      const formValue = this.userForm.value;
      
      if (this.isEditMode && this.user) {
        const updatedUser = {
          ...this.user,
          ...formValue
        };
        
        this.userService.updateUser(this.user.id, updatedUser).subscribe({
          next: () => {
            this.router.navigate(['/user', this.user?.id]);
          },
          error: (error) => {
            this.error = 'Failed to update user. Please try again later.';
            this.loading = false;
            console.error('Error updating user:', error);
          }
        });
      } else {
        this.userService.createUser(formValue).subscribe({
          next: (newUser) => {
            this.router.navigate(['/user', newUser.id]);
          },
          error: (error) => {
            this.error = 'Failed to create user. Please try again later.';
            this.loading = false;
            console.error('Error creating user:', error);
          }
        });
      }
    }
  }

  onCancel() {
    if (this.isEditMode && this.user) {
      this.router.navigate(['/user', this.user.id]);
    } else {
      this.router.navigate(['/']);
    }
  }
} 