import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  GoogleMapsModule,
  MapBicyclingLayer,
  MapPolygon,
  MapPolyline,
  MapRectangle,
  MapTrafficLayer,
} from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { MapboxComponent } from './mapbox/mapbox.component';
import * as togpx from '@tmcw/togeojson';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    GoogleMapsModule,
    MapBicyclingLayer,
    MapTrafficLayer,
    MapPolygon,
    MapPolyline,
    MapRectangle,
    MapboxComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @ViewChild('map') mapContainer!: ElementRef;
  map!: google.maps.Map;

  title = 'maps';
  tpMap = 'GOOGLE';

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 15;
  display!: google.maps.LatLngLiteral;

  polygonOptions: google.maps.PolygonOptions = {
    strokeOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    fillColor: '#0284C7',
    fillOpacity: 0.5,
  };

  vertices: google.maps.LatLngLiteral[] = [
    { lat: 13, lng: 13 },
    { lat: -13, lng: 0 },
    { lat: 13, lng: -13 },
  ];

  bounds: google.maps.LatLngBoundsLiteral = {
    east: 10,
    north: 10,
    south: -10,
    west: -10,
  };
  // kmlUrl = 'assets/kmls/175-1706194535-540571.kml';
  kmlUrl =
    'https://developers.google.com/maps/documentation/javascript/examples/kml/westcampus.kml';
  linhasCoordenadas!: any[];
  path!: { lng: number; lat: number }[];
  polygons!: google.maps.PolygonOptions[];

  ngOnInit(): void {}

  moveMap(event: google.maps.MapMouseEvent) {
    console.log(event.latLng?.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    console.log(event);
  }

  initMap() {
    const coordinates = new google.maps.LatLng(-34.397, 150.644);
    const mapOptions: google.maps.MapOptions = {
      center: coordinates,
      zoom: 8,
    };

    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
  }

  kmlToGeoJson(kmlString: string): any {
    const parser = new DOMParser();
    const root = parser.parseFromString(kmlString, 'application/xml');
    const geoJson = togpx.kml(root);
    return geoJson;
  }

  convertFile(inputFilePath: File): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      const kmlString = event?.target?.result as string;
      // const kml = this.converterKmlParaCoordenas(kmlString);
      const geoJson = this.kmlToGeoJson(kmlString);
      // this.geoJsonToLatLngLiteral(geoJson);
      this.polygons = this.geoJsonToLatLngLiteral_(geoJson);
      const geoJsonString = JSON.stringify(geoJson, null, 2);

      // console.log(geoJsonString);
    };
    reader.readAsText(inputFilePath);
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.convertFile(file);
      // this.converterKmlParaCoordenas(file);
    }
  }

  converterKmlParaCoordenas(area: any): void {
    const parser = new DOMParser();
    const root = parser.parseFromString(area, 'application/xml');
    const placemarks = root.querySelectorAll('Placemark');

    placemarks?.forEach((placemark: Element) => {
      const coordenadasElement = placemark.querySelector(
        'Polygon outerBoundaryIs LinearRing coordinates'
      );

      if (coordenadasElement) {
        const coordenadas = coordenadasElement.textContent;
        if (coordenadas) {
          const listaCoordenadas = coordenadas.split(',0.00');
          const coordenadasFormatadas = [];
          for (const parCoordenadas of listaCoordenadas.slice(0, -1)) {
            const coordenadasPoligono = parCoordenadas.split(',');
            coordenadasFormatadas?.push({
              lat: parseFloat(coordenadasPoligono[1]),
              lng: parseFloat(coordenadasPoligono[0]),
            });
          }

          const arrVertices = [];

          arrVertices?.push({
            id: 1,
            coordenadas: coordenadasFormatadas,
          });

          this.linhasCoordenadas = arrVertices;

          this.vertices = coordenadasFormatadas;

          this.center = coordenadasFormatadas[0];
        }
      }
    });
  }

  geoJsonToLatLngLiteral(geoJson: any): any {
    const features = geoJson.features;
    const latLngArrays = features.map((feature: any) => {
      if (feature.geometry.type === 'GeometryCollection') {
        // Flatten the array of arrays to get a single array of LatLngLiteral objects
        return feature.geometry.geometries
          .filter((geometry: any) => geometry.type === 'Polygon')
          .flatMap((geometry: any) =>
            geometry.coordinates[0].map((coord: any) => ({
              lat: coord[1],
              lng: coord[0],
            }))
          );
      } else if (feature.geometry.type === 'Polygon') {
        return feature.geometry.coordinates[0].map((coord: any) => ({
          lat: coord[1],
          lng: coord[0],
        }));
      }
      return [];
    });

    this.path = latLngArrays;
    this.linhasCoordenadas = latLngArrays;
    this.vertices = latLngArrays;
    this.center = latLngArrays[0][0];
  }

  geoJsonToLatLngLiteral_(geoJson: any): google.maps.PolygonOptions[] {
    const polygons: google.maps.PolygonOptions[] = geoJson.features.map(
      (feature: any) => {
        let paths: google.maps.LatLng[] = [];

        if (feature.geometry.type === 'GeometryCollection') {
          paths = feature.geometry.geometries
            .filter((geometry: any) => geometry.type === 'Polygon')
            .flatMap((geometry: any) =>
              geometry.coordinates[0].map(
                (coord: any) => new google.maps.LatLng(coord[1], coord[0])
              )
            );
        } else if (feature.geometry.type === 'Polygon') {
          paths = feature.geometry.coordinates[0].map(
            (coord: any) => new google.maps.LatLng(coord[1], coord[0])
          );
        }

        // Calculate the center of the paths
        const bounds = new google.maps.LatLngBounds();
        paths.forEach((path) => bounds.extend(path));
        const centerLatLng = bounds.getCenter(); // This is a LatLng object
        this.center = {
          lat: centerLatLng.lat(),
          lng: centerLatLng.lng(),
        }; // Convert to LatLngLiteral

        return {
          paths: new google.maps.MVCArray(paths),
          fillColor: feature?.properties?.fill || 'red', // Default color if not provided
          strokeColor: feature?.properties?.stroke || 'black', // Default color if not provided
          center: this.center, // Use the LatLngLiteral for the center
        };
      }
    );

    return polygons;
  }
}
