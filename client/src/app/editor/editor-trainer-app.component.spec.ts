import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTrainerAppComponent } from './editor-trainer-app.component';

describe('EditorTrainerAppComponent', () => {
  let component: EditorTrainerAppComponent;
  let fixture: ComponentFixture<EditorTrainerAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorTrainerAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorTrainerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
