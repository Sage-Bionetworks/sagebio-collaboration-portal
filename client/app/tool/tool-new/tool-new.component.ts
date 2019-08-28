import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { geneId } from '../../../../server/config/seeds/default/organizations';  // TODO: get from API
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../app.constants';
import slugify from 'slugify';
import { UrlValidators } from 'components/validation/url-validators';

@Component({
    selector: 'tool-new',
    template: require('./tool-new.html'),
    styles: [require('./tool-new.scss')],
})
export class ToolNewComponent implements OnInit, OnDestroy {
    private toolSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newTool: undefined
    };

    @Output() newTool: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ToolService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private toolService: ToolService) {

        this.toolSpecs = config.models.tool;
        console.log('toolSpecs', this.toolSpecs);
        this.newForm = this.formBuilder.group({
            title: ['', [
                Validators.required,
                Validators.minLength(this.toolSpecs.title.minlength),
                Validators.maxLength(this.toolSpecs.title.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(this.toolSpecs.description.minlength),
                Validators.maxLength(this.toolSpecs.description.maxlength)
            ]],
            apiServerUrl: ['', [
                Validators.required,
                UrlValidators.https(),
                UrlValidators.noTrailingSlash()
            ]],
            apiHealthCheckUrl: ['', [
                Validators.required,
                UrlValidators.https(),
                UrlValidators.noTrailingSlash()
            ]],
            website: ['', [
                Validators.required,
                UrlValidators.https(),
                UrlValidators.noTrailingSlash()
            ]]
        });
    }

    ngOnInit() { }

    ngOnDestroy() { }

    createNewTool(): void {
        let newTool = this.newForm.value;
        let defaultOrganization = { // We just need a partial object here - no need to populate a full Organization interface
            _id: geneId,    // Use the Roche organization ID
        };

        // Slug automatically generated based on the tool name
        newTool.slug = slugify(this.newForm.value.name).toLowerCase();
        newTool.organization = defaultOrganization;

        this.toolService.create(newTool)
            .subscribe(tool => {
                this.newTool.emit(tool);
                this.close.emit(null);
            }, err => {
                console.log('ERROR', err);
                this.errors.newTool = err.message;
            });
    }
}
