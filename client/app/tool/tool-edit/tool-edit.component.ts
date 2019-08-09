import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToolService } from '../tool.service';
import { Tool } from 'models/entities/tool.model';
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../app.constants';
import slugify from 'slugify';
import { UrlValidators } from 'components/validation/url-validators';
import { map } from 'lodash';

@Component({
    selector: 'tool-edit',
    template: require('./tool-edit.html'),
    styles: [require('./tool-edit.scss')],
})
export class ToolEditComponent implements OnInit, OnDestroy {
    private toolSpecs = {};
    private editForm: FormGroup;
    private errors = {
        editTool: undefined
    };
    @Input() tool: Tool;
    @Output() editTool: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService, ToolService];
    constructor(private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private toolService: ToolService) {
        this.toolSpecs = config.models.tool;
    }

    ngOnInit() {
        this.pageTitleService.title = 'Edit Tool';
        if (this.tool) {
            console.log('this.tool: ', this.tool);
            this.editForm = this.formBuilder.group({
                name: [this.tool.name, [
                    Validators.required,
                    Validators.minLength(config.models.tool.name.minlength),
                    Validators.maxLength(config.models.tool.name.maxlength)
                ]],
                description: [this.tool.description, [
                    Validators.required,
                    Validators.minLength(config.models.tool.description.minlength),
                    Validators.maxLength(config.models.tool.description.maxlength)
                ]],
                apiServerUrl: [this.tool.apiServerUrl, [
                    Validators.required,
                    UrlValidators.https(),
                    UrlValidators.noTrailingSlash()
                ]],
                apiHealthCheckUrl: [this.tool.apiHealthCheckUrl, [
                    Validators.required,
                    UrlValidators.https(),
                    UrlValidators.noTrailingSlash()
                ]],
                website: [this.tool.website, [
                    Validators.required,
                    UrlValidators.https(),
                    UrlValidators.noTrailingSlash()
                ]]
            });
        }
    }

    ngOnDestroy() { }

    onEditTool(): void {
        let editedTool = this.editForm.value;
        editedTool.slug = slugify(this.editForm.value.name).toLowerCase();
        const patches = map(editedTool, (value, key) => ({
            op: 'replace',
            path: `/${key}`,
            value: value
        }));

        this.toolService.updateTool(patches, this.tool._id)
            .subscribe(tool => {
                this.editTool.emit(tool);
                this.close.emit(null);
            }, err => {
                console.log('ERROR', err);
                this.errors.editTool = err.message;
            });
    }
}
