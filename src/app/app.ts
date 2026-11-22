import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayout } from './layouts/main/main';

@Component({
  selector: 'app-root',
  imports: [
    MainLayout,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('minecraft-server-manager');
}
