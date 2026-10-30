import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-overlapping-navigations-page',
  template: `
    <ion-content>
      <div class="page-id">{{ id }}</div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonContent]
})
export class OverlappingNavigationsPageComponent {
  id = inject(ActivatedRoute).snapshot.paramMap.get('id');
}
