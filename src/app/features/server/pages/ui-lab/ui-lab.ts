import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { IpDisplay } from '../../../../shared/ui/ip-display/ip-display';
import { CostSignal } from '../../../../shared/ui/cost-signal/cost-signal';
import { InfoCard } from '../../../../shared/ui/info-card/info-card';

@Component({
  selector: 'app-ui-lab',
  standalone: true,
  imports: [StatusBadge, IpDisplay, CostSignal, InfoCard],
  templateUrl: './ui-lab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLab {
  readonly infoRows = [
    { label: 'Dificultad', value: 'Normal' },
    { label: 'Mundo', value: 'Semilla 1234' },
    { label: 'Versión', value: '1.21' },
  ];

  onCopied(): void {
    // no-op: laboratorio visual para probar TODOs del alumno
  }
}
