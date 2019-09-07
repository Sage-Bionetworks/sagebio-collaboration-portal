import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataCatalogService } from '../data-catalog.service';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { geneId } from '../../../../server/config/seeds/default/organizations';  // TODO: get from API
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../app.constants';
import { UrlValidators } from 'components/validation/url-validators';

@Component({
    selector: 'data-catalog-new',
    template: require('./data-catalog-new.html'),
    styles: [require('./data-catalog-new.scss')],
})
export class DataCatalogNewComponent implements OnInit {
    private dataCatalogSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newDataCatalog: undefined
    };

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        DataCatalogService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private dataCatalogService: DataCatalogService) {

        this.dataCatalogSpecs = config.models.dataCatalog;
        this.newForm = this.formBuilder.group({
            title: ['', [
                Validators.required,
                Validators.minLength(this.dataCatalogSpecs.title.minlength),
                Validators.maxLength(this.dataCatalogSpecs.title.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(this.dataCatalogSpecs.description.minlength),
                Validators.maxLength(this.dataCatalogSpecs.description.maxlength)
            ]],
            picture: ['', [
                Validators.required,
                UrlValidators.noTrailingSlash()
            ]],
            visibility: [this.dataCatalogSpecs.visibility.default.value, [
                Validators.required
            ]],
            website: ['', [
                Validators.required,
                UrlValidators.noTrailingSlash()
            ]],
            // organization: ['', [
            //     Validators.required
            // ]],
            apiType: [this.dataCatalogSpecs.apiType.default.value, [
                Validators.required
            ]],
            apiServerUrl: ['', [
                Validators.required,
                UrlValidators.noTrailingSlash()
            ]]
        });
    }

    ngOnInit() {
        this.pageTitleService.title = 'New Data Catalog';
    }

    createNewDataCatalog(): void {
        let newDataCatalog = this.newForm.value;
        console.log('new catalog', newDataCatalog);
        newDataCatalog.organization = {
            _id: geneId,
        };

        this.dataCatalogService.create(newDataCatalog)
            .subscribe(catalog => {
                this.router.navigate(['/data-catalogs', catalog._id]);
            }, err => {
                console.error(err);
                this.errors.newDataCatalog = err.message;
            });
    }
}
