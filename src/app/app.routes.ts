import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'servers', pathMatch: 'full' },
  {
    path: 'servers',
    loadComponent: () =>
      import('./features/server/pages/server-list-page/server-list-page').then((m) => m.ServerListPage),
  },
  {
    path: 'servers/new',
    loadComponent: () =>
      import('./features/server/pages/server-create-page/server-create-page').then((m) => m.ServerCreatePage),
  },
  {
    path: 'ui-lab',
    loadComponent: () =>
      import('./features/server/pages/ui-lab/ui-lab').then((m) => m.UiLab),
  },
];
