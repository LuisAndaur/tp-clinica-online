import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHcEspecialistaComponent } from './ver-hc-especialista.component';

describe('VerHcEspecialistaComponent', () => {
  let component: VerHcEspecialistaComponent;
  let fixture: ComponentFixture<VerHcEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerHcEspecialistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerHcEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
