import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHcPacienteComponent } from './ver-hc-paciente.component';

describe('VerHcPacienteComponent', () => {
  let component: VerHcPacienteComponent;
  let fixture: ComponentFixture<VerHcPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerHcPacienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerHcPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
