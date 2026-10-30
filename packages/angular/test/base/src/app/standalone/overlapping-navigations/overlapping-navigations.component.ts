import { Component, inject } from '@angular/core';
import type { AnimationBuilder } from '@ionic/angular';
import { createAnimation, IonButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar, NavController } from '@ionic/angular';

/**
 * Every transition takes a fixed 400ms so the navigations below
 * overlap the running transitions at known points.
 */
const slowAnimation: AnimationBuilder = (_baseEl, opts) =>
  createAnimation().addElement(opts.enteringEl).duration(400).fromTo('opacity', '0', '1');

@Component({
  selector: 'app-overlapping-navigations',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Overlapping Navigations</ion-title>
        <ion-buttons slot="end">
          <ion-button id="navigate" (click)="navigate()">Navigate</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-router-outlet id="overlapping-outlet"></ion-router-outlet>
    </ion-content>
  `,
  standalone: true,
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar]
})
export class OverlappingNavigationsComponent {
  private navCtrl = inject(NavController);

  navigate() {
    // Pages 2 and 3 queue behind page 1, page 4 starts while page 3 is
    // still running, page 5 queues behind page 4 and page 6 arrives after
    // page 3 finished but before page 4 did.
    [0, 50, 100, 1000, 1100, 1400].forEach((delay, i) => {
      setTimeout(() => this.navCtrl.navigateForward(`/standalone/overlapping-navigations/${i + 1}`, { animation: slowAnimation }), delay);
    });
  }
}
