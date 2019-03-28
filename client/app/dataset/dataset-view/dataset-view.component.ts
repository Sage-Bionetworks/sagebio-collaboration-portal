import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DatasetService } from '../dataset.service';
import { Dataset } from '../../../../shared/interfaces/dataset.model';

@Component({
    selector: 'dataset-view',
    template: require('./dataset-view.html'),
    styles: [require('./dataset-view.scss')],
})
export class DatasetViewComponent {
    private _dataset: Dataset;

    static parameters = [Router];
    constructor(private router: Router) { }

    get dataset() {
        return this._dataset;
    }

    @Input()
    set dataset(dataset) {
        this._dataset = dataset;
    }
}
