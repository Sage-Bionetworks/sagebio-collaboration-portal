import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'lodash';
import { PageTitleService } from 'components/page-title/page-title.service';
import { UrlValidators } from 'components/validation/url-validators';
import { Tool } from 'models/entities/tool.model';
import { ToolService } from '../tool.service';
import config from '../../app.constants';

@Component({
    selector: 'tool-edit',
    template: require('./tool-edit.html'),
    styles: [require('./tool-edit.scss')],
})
export class ToolEditComponent implements OnInit {
    @Input() tool: Tool;
    @Output() editTool: EventEmitter<Tool> = new EventEmitter<Tool>();
    @Output() close: EventEmitter<any> = new EventEmitter<any>();

    private toolSpecs: any;
    private editForm: FormGroup;
    private errors = {
        editTool: undefined
    };

    static parameters = [FormBuilder, PageTitleService, ToolService];
    constructor(private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private toolService: ToolService) {
            this.toolSpecs = config.models.tool;
            this.editForm = this.formBuilder.group({
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
                picture: ['', [
                    Validators.required,
                    UrlValidators.https(),
                    UrlValidators.noTrailingSlash()
                ]],
                visibility: [this.toolSpecs.visibility.default.value, [
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
        this.pageTitleService.title = 'Edit Tool';
        if (this.tool) {
            this.editForm.setValue({
                title: this.tool.title,
                description: this.tool.description,
                picture: this.tool.picture,
                visibility: this.tool.visibility,
                apiHealthCheckUrl: this.tool.apiHealthCheckUrl,
                website: this.tool.website
            });
            this.editForm.markAllAsTouched();
        }
    }

    onEditTool(): void {
        let editedTool = this.editForm.value;
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
