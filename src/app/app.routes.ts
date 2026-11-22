import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'servers', pathMatch: 'full' },
  {
    path: 'servers',
    loadComponent: () =>
      import('./features/server/pages/server-list-page/server-list-page').then((m) => m.ServerListPage),
  },
  {
    path: 'ui-lab',
    loadComponent: () =>
      import('./features/server/pages/ui-lab/ui-lab').then((m) => m.UiLab),
  },
];
