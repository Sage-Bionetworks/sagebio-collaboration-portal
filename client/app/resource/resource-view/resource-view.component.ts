import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ResourceService } from '../resource.service';
import { Resource } from 'models/resources/resource.model';

@Component({
    selector: 'resource-view',
    template: require('./resource-view.html'),
    styles: [require('./resource-view.scss')],
})
export class ResourceViewComponent {
    private _resource: Resource;

    static parameters = [Router];
    constructor(private router: Router) { }

    get resource() {
        return this._resource;
    }

    @Input()
    set resource(resource) {
        this._resource = resource;
    }
}
