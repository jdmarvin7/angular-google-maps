import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorCodigosComponent } from './visualizador-codigos.component';

describe('VisualizadorCodigosComponent', () => {
  let component: VisualizadorCodigosComponent;
  let fixture: ComponentFixture<VisualizadorCodigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizadorCodigosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisualizadorCodigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
