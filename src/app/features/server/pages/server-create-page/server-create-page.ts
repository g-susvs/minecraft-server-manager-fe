import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IWorldOptions, TDifficulty } from '../../../../core/models/server.model';
import { ServerStore } from '../../../../core/state/server.store';
import { CREATE_CONTENT } from '../../content/create.content';

@Component({
  selector: 'app-server-create-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './server-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly store = inject(ServerStore);
  readonly content = CREATE_CONTENT;

  readonly serverError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[\p{L}\p{N} _-]+$/u)],
    ],
    difficulty: ['normal' as TDifficulty, Validators.required],
    worldOptions: this.fb.nonNullable.group({
      showCoordinates: [true],
      bonusChest: [false],
      starterMap: [false],
    }),
  });

  nameError(): string | null {
    const control = this.form.controls.name;
    if (!control.dirty && !control.touched) return null;
    if (control.hasError('required')) return this.content.nameErrors.required;
    if (control.hasError('minlength')) return this.content.nameErrors.minLength;
    if (control.hasError('pattern')) return this.content.nameErrors.pattern;
    if (control.hasError('taken')) return this.content.nameErrors.taken;
    return null;
  }

  isOn(key: keyof IWorldOptions): boolean {
    return this.form.controls.worldOptions.controls[key].value;
  }

  submit(): void {
    this.serverError.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.store.create(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/servers']),
      error: (err: { code?: string }) => {
        if (err.code === 'NAME_IN_USE') {
          this.form.controls.name.setErrors({ taken: true });
        } else {
          this.serverError.set(this.content.saveFailed);
        }
      },
    });
  }
}
