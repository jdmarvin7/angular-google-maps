import { environment } from './../../environments/environment';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapbox',
  standalone: true,
  imports: [],
  templateUrl: './mapbox.component.html',
  styleUrl: './mapbox.component.scss',
})
export class MapboxComponent implements OnInit {
  @ViewChild('map', { static: true }) mapContainer!: ElementRef;
  map!: mapboxgl.Map;

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: environment.accessTokenMapbox,
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.50,  40], // Longitude, Latitude
      zoom:  9
    })
  }
}
