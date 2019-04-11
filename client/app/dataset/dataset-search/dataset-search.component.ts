import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatasetService } from '../dataset.service';
import { Dataset } from '../../../../shared/interfaces/dataset.model';
// import { ImagePipe, WebpPipe } from '../../components/image/image.pipe';

@Component({
    selector: 'dataset-search',
    template: require('./dataset-search.html'),
    styles: [require('./dataset-search.scss')]
})
export class DatasetSearchComponent {
    private searchForm: FormGroup;
    private datasets: Observable<Dataset[]>;

    static parameters = [Router, FormBuilder, DatasetService];
    constructor(private router: Router, private formBuilder: FormBuilder,
        private datasetService: DatasetService) {
        this.searchForm = this.formBuilder.group({
            search: ['', []]
        });
        // this.games = this.gameService.searchGamesByName(this.searchForm.controls.search.valueChanges);
    }

    // goToGame(game: Game): void {
    //     this.router.navigate(['/games', game._id])
    //         .then(() => this.searchForm.controls.search.setValue(''));
    // }

    getResults(): void {
        console.log('TODO: Display a page with results (game, instance?, etc.)');
    }
}
