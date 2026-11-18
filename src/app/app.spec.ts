import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideAppIcons } from './icons';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideAppIcons()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the brand and the workspace heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.workspace-brand')?.textContent).toContain('Pulse');
    expect(compiled.querySelector('h1')?.textContent).toContain('Tasks');
  });
});
