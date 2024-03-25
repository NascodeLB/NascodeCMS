import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalStaticKeywordsComponent } from './global-static-keywords.component';

describe('GlobalStaticKeywordsComponent', () => {
  let component: GlobalStaticKeywordsComponent;
  let fixture: ComponentFixture<GlobalStaticKeywordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalStaticKeywordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlobalStaticKeywordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
