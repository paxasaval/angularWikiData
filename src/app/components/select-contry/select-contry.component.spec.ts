import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectContryComponent } from './select-contry.component';

describe('SelectContryComponent', () => {
  let component: SelectContryComponent;
  let fixture: ComponentFixture<SelectContryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectContryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectContryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
