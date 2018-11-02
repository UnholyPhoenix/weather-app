import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeCastComponent } from './forecast.component';

describe('AboutComponent', () => {
  let component: ForeCastComponent;
  let fixture: ComponentFixture<ForeCastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForeCastComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForeCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
