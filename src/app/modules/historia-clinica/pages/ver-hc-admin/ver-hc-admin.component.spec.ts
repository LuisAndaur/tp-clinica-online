import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerHcAdminComponent } from './ver-hc-admin.component';

describe('VerHcAdminComponent', () => {
  let component: VerHcAdminComponent;
  let fixture: ComponentFixture<VerHcAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerHcAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerHcAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
