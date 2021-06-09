import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateActionComponent } from './corporate-action.component';

describe('CorporateActionComponent', () => {
  let component: CorporateActionComponent;
  let fixture: ComponentFixture<CorporateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
