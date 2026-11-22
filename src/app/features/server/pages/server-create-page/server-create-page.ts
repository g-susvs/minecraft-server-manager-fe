import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IApiError } from '../../../../core/models/api-error.model';
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
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9 _-]+$/),
      ],
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
    if (control.hasError('maxlength')) return this.content.nameErrors.maxLength;
    if (control.hasError('pattern')) return this.content.nameErrors.pattern;
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
      error: (err: IApiError) => {
        // Las validaciones del backend traen un mensaje específico; el resto usa el genérico.
        this.serverError.set(err.code === 'VALIDATION' ? err.message : this.content.saveFailed);
      },
    });
  }
}
