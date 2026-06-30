import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentRoute = '/home';

  constructor(private readonly router: Router) {
    this.currentRoute = this.router.url || '/home';
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  get isResumeActive(): boolean {
    return this.currentRoute.startsWith('/resume');
  }

  get isPortfolioActive(): boolean {
    return this.currentRoute.startsWith('/home') || this.currentRoute === '/';
  }
}
