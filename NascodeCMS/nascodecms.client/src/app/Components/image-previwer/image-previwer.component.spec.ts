import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagePreviwerComponent } from './image-previwer.component';

describe('ImagePreviwerComponent', () => {
  let component: ImagePreviwerComponent;
  let fixture: ComponentFixture<ImagePreviwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagePreviwerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagePreviwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
