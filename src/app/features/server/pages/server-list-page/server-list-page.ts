import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ServerStore } from '../../../../core/state/server.store';
import { LIST_CONTENT } from '../../content/list.content';
import { ServerCard } from '../../components/server-card/server-card';

@Component({
  selector: 'app-server-list-page',
  imports: [RouterLink, ServerCard],
  templateUrl: './server-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServerListPage implements OnInit {
  readonly store = inject(ServerStore);
  readonly content = LIST_CONTENT;

  ngOnInit(): void {
    this.store.loadAll();
  }
}
