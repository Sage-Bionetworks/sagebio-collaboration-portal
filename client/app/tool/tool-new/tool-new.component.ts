import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { geneId } from '../../../../server/config/seeds/all/organizations'
import { PageTitleService } from '../../../components/page-title/page-title.service';
import config from '../../app.constants';
import slugify from 'slugify';

@Component({
    selector: 'tool-new',
    template: require('./tool-new.html'),
    styles: [require('./tool-new.scss')],
})
export class ToolNewComponent implements OnInit, OnDestroy {
    private toolSpecs = {};
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
        this.newForm = this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.minLength(config.models.tool.name.minlength),
                Validators.maxLength(config.models.tool.name.maxlength)
            ]],
            description: ['', [
                Validators.required,
                Validators.minLength(config.models.tool.description.minlength),
                Validators.maxLength(config.models.tool.description.maxlength)
            ]],
            apiServerUrl: ['', [
                Validators.required,
            ]],
            website: ['', [
                Validators.required,
            ]]
        });
    }

    ngOnInit() { }

    ngOnDestroy() { }

    createNewTool(): void {
        let newTool = this.newForm.value;
        let defaultOrganization = { // We just need a partial object here - no need to populate a full Organization interface
            _id: geneId,    // Use the Roche organization ID
        }

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
