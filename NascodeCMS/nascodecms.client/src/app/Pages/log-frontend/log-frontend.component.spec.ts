import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogFrontendComponent } from './log-frontend.component';

describe('LogFrontendComponent', () => {
  let component: LogFrontendComponent;
  let fixture: ComponentFixture<LogFrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogFrontendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogFrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
