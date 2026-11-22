import { Component } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { FormField } from '../../shared/ui/form-filed/form-field';

@Component({
  selector: 'app-server',
  imports: [Button, FormField],
  templateUrl: './server.html',
  styleUrl: './server.css',
})
export class ServerPage {}
