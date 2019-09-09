import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'lodash';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UrlValidators } from 'components/validation/url-validators';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { DataCatalogService } from '../data-catalog.service';
import config from '../../app.constants';

@Component({
    selector: 'data-catalog-edit',
    template: require('./data-catalog-edit.html'),
    styles: [require('./data-catalog-edit.scss')],
})
export class DataCatalogEditComponent implements OnInit {
    @Input() dataCatalog: DataCatalog;
    @Output() editDataCatalog: EventEmitter<DataCatalog> = new EventEmitter<DataCatalog>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    private dataCatalogSpecs: any;
    private editForm: FormGroup;
    private errors = {
        editDataCatalog: undefined
    };

    static parameters = [FormBuilder, PageTitleService, DataCatalogService];
    constructor(private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private dataCatalogService: DataCatalogService) {
            this.dataCatalogSpecs = config.models.dataCatalog;
            this.editForm = this.formBuilder.group({
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
                    UrlValidators.https(),
                    UrlValidators.noTrailingSlash()
                ]],
                visibility: [this.dataCatalogSpecs.visibility.default.value, [
                    Validators.required
                ]],
                apiHealthCheckUrl: ['', [
                    Validators.required,
                    UrlValidators.https(),
                    UrlValidators.noTrailingSlash()
                ]],
                website: ['', [
                    Validators.required,
                    UrlValidators.http(),
                    UrlValidators.noTrailingSlash()
                ]]
            });
    }

    ngOnInit() {
        this.pageTitleService.title = 'Edit DataCatalog';
        if (this.dataCatalog) {
            this.editForm.setValue({
                title: this.dataCatalog.title,
                description: this.dataCatalog.description,
                picture: this.dataCatalog.picture,
                visibility: this.dataCatalog.visibility,
                apiHealthCheckUrl: this.dataCatalog.apiHealthCheckUrl,
                website: this.dataCatalog.website
            });
            this.editForm.markAllAsTouched();
        }
    }

    onEditDataCatalog(): void {
        let editedDataCatalog = this.editForm.value;
        const patches = map(editedDataCatalog, (value, key) => ({
            op: 'replace',
            path: `/${key}`,
            value: value
        }));

        this.dataCatalogService.update(this.dataCatalog._id, patches)
            .subscribe(dataCatalog => {
                this.editDataCatalog.emit(dataCatalog);
                this.close.emit(null);
            }, err => {
                console.error(err);
                this.errors.editDataCatalog = err.message;
            });
    }
}
