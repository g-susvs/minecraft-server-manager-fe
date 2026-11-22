import { Component, Input } from '@angular/core';
import clsx from '../../../libs/clsx';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {

  @Input() value!: string;

  @Input() placeholder: string = "" ;

  @Input() hint?: string;

  @Input() errorMessage?: string

  get clasesCSS(){
    return clsx("input", 
      false && "input--error"
    )
  }
}
