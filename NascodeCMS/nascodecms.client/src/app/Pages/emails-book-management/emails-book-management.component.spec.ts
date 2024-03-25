import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailsBookManagementComponent } from './emails-book-management.component';

describe('EmailsBookManagementComponent', () => {
  let component: EmailsBookManagementComponent;
  let fixture: ComponentFixture<EmailsBookManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailsBookManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailsBookManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
