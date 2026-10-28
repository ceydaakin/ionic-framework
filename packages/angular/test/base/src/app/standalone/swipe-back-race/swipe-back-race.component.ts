import { Component } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/angular';

@Component({
  selector: 'app-swipe-back-race',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/standalone"></ion-back-button>
        </ion-buttons>
        <ion-title>Swipe Back Race</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-router-outlet></ion-router-outlet>
    </ion-content>
  `,
  standalone: true,
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar]
})
export class SwipeBackRaceComponent {}
