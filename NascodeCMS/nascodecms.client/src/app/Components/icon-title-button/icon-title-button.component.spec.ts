import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTitleButtonComponent } from './icon-title-button.component';

describe('IconTitleButtonComponent', () => {
  let component: IconTitleButtonComponent;
  let fixture: ComponentFixture<IconTitleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconTitleButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconTitleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
