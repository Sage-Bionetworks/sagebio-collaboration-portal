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
            this.pageTitleService.title = 'Edit Tool';
            this.editForm = this.formBuilder.group({
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
                apiHealthCheckUrl: ['', [
                    Validators.required,
                    UrlValidators.noTrailingSlash()
                ]],
                website: ['', [
                    Validators.required,
                    UrlValidators.noTrailingSlash()
                ]]
            });
    }

    ngOnInit() {
        if (this.tool) {
            this.editForm.setValue({
                name: this.tool.name,
                description: this.tool.description,
                apiHealthCheckUrl: this.tool.apiHealthCheckUrl,
                website: this.tool.website
            });
            this.editForm.markAllAsTouched();
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
                console.error(err);
                this.errors.editTool = err.message;
            });
    }
}
