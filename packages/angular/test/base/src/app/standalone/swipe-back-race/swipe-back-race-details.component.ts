import { Component, inject } from '@angular/core';
import { IonButton, IonContent, NavController } from '@ionic/angular';

@Component({
  selector: 'app-swipe-back-race-details',
  template: `
    <ion-content>
      <ion-button id="nav-back" (click)="navCtrl.back()">Go Back</ion-button>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonContent]
})
export class SwipeBackRaceDetailsComponent {
  navCtrl = inject(NavController);
}
