import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSocialMediaBarComponent } from './header-social-media-bar.component';

describe('HeaderSocialMediaBarComponent', () => {
  let component: HeaderSocialMediaBarComponent;
  let fixture: ComponentFixture<HeaderSocialMediaBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderSocialMediaBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSocialMediaBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
