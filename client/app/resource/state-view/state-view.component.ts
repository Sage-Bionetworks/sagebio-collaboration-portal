import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { ResourceService } from '../resource.service';
import { State } from 'models/resources/state.model';

@Component({
    selector: 'state-view',
    template: require('./state-view.html'),
    styles: [require('./state-view.scss')],
})
export class StateViewComponent {
    private _state: State;

    static parameters = [Router];
    constructor(private router: Router) { }

    get state() {
        return this._state;
    }

    @Input()
    set state(state) {
        this._state = state;
    }
}
