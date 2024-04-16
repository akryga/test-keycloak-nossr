import { NgIf } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, Component, importProvidersFrom, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, KeycloakAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent{
  title = 'test-keycloak-nossr';

  public isLoggedIn: boolean = false;
  public userProfile?: KeycloakProfile;

  constructor(private readonly keycloak: KeycloakService){
    this.keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'testrealm',
        clientId: 'myapp'
      },
      loadUserProfileAtStartUp: true,
      initOptions: {
        onLoad: 'check-sso',
        pkceMethod: 'S256', 
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: `${location.origin}/assets/silent-check-sso.html`
      }
    }).then(r => {
      this.isLoggedIn = r;
    if (this.isLoggedIn) {
      this.keycloak.loadUserProfile()
      .then(p => {this.userProfile = p})
      .catch(e => {console.error(e)});
    }
    })
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
