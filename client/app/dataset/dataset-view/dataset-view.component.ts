import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DatasetService } from '../dataset.service';
import { CkanDataset } from '../../../../shared/interfaces/ckan/ckan-dataset.model';
import { DataCatalog } from '../../../../shared/interfaces/data-catalog.model';

@Component({
    selector: 'dataset-view',
    template: require('./dataset-view.html'),
    styles: [require('./dataset-view.scss')],
})
export class DatasetViewComponent {
    @Input()private dataset: CkanDataset;
    @Input() private catalog: DataCatalog;

    static parameters = [Router];
    constructor(private router: Router) { }
}
