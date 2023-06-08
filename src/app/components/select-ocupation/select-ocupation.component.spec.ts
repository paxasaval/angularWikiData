import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOcupationComponent } from './select-ocupation.component';

describe('SelectOcupationComponent', () => {
  let component: SelectOcupationComponent;
  let fixture: ComponentFixture<SelectOcupationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectOcupationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOcupationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
