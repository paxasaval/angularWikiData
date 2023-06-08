import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHumanComponent } from './card-human.component';

describe('CardHumanComponent', () => {
  let component: CardHumanComponent;
  let fixture: ComponentFixture<CardHumanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardHumanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardHumanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
