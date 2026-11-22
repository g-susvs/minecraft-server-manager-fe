import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TDifficulty, IWorldOptions } from '../../../../core/models/server.model';
import { ServerStore } from '../../../../core/state/server.store';

const NAME_HELPER = 'Solo letras, números, espacios, guiones y guiones bajos';

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

  readonly nameHelper = NAME_HELPER;
  readonly serverError = signal<string | null>(null);

  readonly difficulties: { value: TDifficulty; label: string }[] = [
    { value: 'pacifica', label: 'Pacífica' },
    { value: 'facil', label: 'Fácil' },
    { value: 'normal', label: 'Normal' },
    { value: 'dificil', label: 'Difícil' },
  ];

  readonly worldToggles: { key: keyof IWorldOptions; label: string; hint: string }[] = [
    { key: 'showCoordinates', label: 'Mostrar coordenadas', hint: 'Muestra tu posición X, Y, Z en el juego' },
    { key: 'bonusChest', label: 'Cofre de regalo', hint: 'Incluye un cofre con objetos al empezar' },
    { key: 'starterMap', label: 'Mapa inicial', hint: 'Te entrega un mapa del mundo al empezar' },
  ];

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
    if (control.hasError('required')) return 'Escribe un nombre para el servidor';
    if (control.hasError('minlength')) return 'Mínimo 3 caracteres';
    if (control.hasError('pattern')) return NAME_HELPER;
    if (control.hasError('taken')) return 'Ya existe un servidor con ese nombre';
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
          this.serverError.set('No pudimos crear el servidor. Intenta de nuevo.');
        }
      },
    });
  }
}
