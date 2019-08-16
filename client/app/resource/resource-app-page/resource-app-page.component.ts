import { Component } from '@angular/core';
import { Resource } from 'models/entities/resources/resource.model';

@Component({
    selector: 'resource-app-page',
    template: require('./resource-app-page.html'),
    styles: [require('./resource-app-page.scss')],
})
export class ResourceAppPageComponent {
  private resource: Resource

  setResource(resource: Resource) {
    this.resource = resource
  }
}
