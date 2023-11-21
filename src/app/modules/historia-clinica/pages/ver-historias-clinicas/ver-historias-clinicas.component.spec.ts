import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHistoriasClinicasComponent } from './ver-historias-clinicas.component';

describe('VerHistoriasClinicasComponent', () => {
  let component: VerHistoriasClinicasComponent;
  let fixture: ComponentFixture<VerHistoriasClinicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerHistoriasClinicasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerHistoriasClinicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
