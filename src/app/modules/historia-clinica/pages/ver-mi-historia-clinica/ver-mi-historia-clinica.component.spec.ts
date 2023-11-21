import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMiHistoriaClinicaComponent } from './ver-mi-historia-clinica.component';

describe('VerMiHistoriaClinicaComponent', () => {
  let component: VerMiHistoriaClinicaComponent;
  let fixture: ComponentFixture<VerMiHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerMiHistoriaClinicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerMiHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
