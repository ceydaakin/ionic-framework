import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonRouterLink } from '@ionic/angular';

@Component({
  selector: 'app-swipe-back-race-main',
  template: `
    <ion-content>
      <ion-item routerLink="/standalone/swipe-back-race/details" id="swipe-back-race-details">
        <ion-label>Details</ion-label>
      </ion-item>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent, IonItem, IonLabel, IonRouterLink, RouterModule]
})
export class SwipeBackRaceMainComponent {}
