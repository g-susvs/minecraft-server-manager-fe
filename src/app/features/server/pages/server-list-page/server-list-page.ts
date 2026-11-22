import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ServerStore } from '../../../../core/state/server.store';
import { ServerCard } from '../../components/server-card/server-card';

@Component({
  selector: 'app-server-list-page',
  imports: [RouterLink, ServerCard],
  templateUrl: './server-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerListPage implements OnInit {
  readonly store = inject(ServerStore);

  ngOnInit(): void {
    this.store.loadAll();
  }
}
