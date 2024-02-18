import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visualizador-codigos',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './visualizador-codigos.component.html',
  styleUrl: './visualizador-codigos.component.scss'
})
export class VisualizadorCodigosComponent {
  @Input() jsonData: any;

  formatJson(json: any): string {
    return JSON.stringify(json, null, 2)
  }
}
