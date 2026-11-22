import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { StatusBadge } from '../../../../shared/ui/status-badge/status-badge';
import { IServer } from '../../../../core/models/server.model';

@Component({
  selector: 'app-server-card',
  imports: [RouterLink, StatusBadge],
  templateUrl: './server-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerCard {
  readonly server = input.required<IServer>();
}
