import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToolService } from '../tool.service';
import { geneId } from '../../../../server/config/seeds/default/organizations';  // TODO: get from API
import { PageTitleService } from 'components/page-title/page-title.service';
import config from '../../app.constants';
import { UrlValidators } from 'components/validation/url-validators';

@Component({
    selector: 'tool-new',
    template: require('./tool-new.html'),
    styles: [require('./tool-new.scss')],
})
export class ToolNewComponent implements OnInit {
    private toolSpecs: any;
    private newForm: FormGroup;
    private errors = {
        newTool: undefined
    };

    static parameters = [Router, ActivatedRoute, FormBuilder, PageTitleService,
        ToolService];
    constructor(private router: Router, private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private pageTitleService: PageTitleService,
        private toolService: ToolService) {

        this.toolSpecs = config.models.tool;
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
            picture: [this.toolSpecs.picture.default, [
                Validators.required,
                UrlValidators.https(),
                UrlValidators.noTrailingSlash()
            ]],
            visibility: [this.toolSpecs.visibility.default.value, [
                Validators.required
            ]],
            // apiServerUrl: ['', [
            //     Validators.required,
            //     UrlValidators.https(),
            //     UrlValidators.noTrailingSlash()
            // ]],
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
        this.pageTitleService.setTitle('New Tool');
    }

    createNewTool(): void {
        let newTool = this.newForm.value;
        newTool.organization = {
            _id: geneId,
        };

        this.toolService.create(newTool)
            .subscribe(tool => {
                this.router.navigate(['/tools', tool._id]);
            }, err => {
                console.error(err);
                this.errors.newTool = err.message;
            });
    }
}
