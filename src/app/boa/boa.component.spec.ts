import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BOAComponent } from './boa.component';

describe('BOAComponent', () => {
  let component: BOAComponent;
  let fixture: ComponentFixture<BOAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BOAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BOAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
