import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ToolService } from '../tool.service';
import { Tool } from '../../../../shared/interfaces/tool.model';
import { PageTitleService } from '../../../components/page-title/page-title.service';
// import { Observable, forkJoin, combineLatest, of, empty, never } from 'rxjs';
// import { filter, map, switchMap, tap, concatMap, mergeMap, catchError } from 'rxjs/operators';
import config from '../../app.constants';

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
            // name: ['', [
            //     Validators.required,
            //     Validators.minLength(config.models.tool.name.minlength),
            //     Validators.maxLength(config.models.tool.name.maxlength)
            // ]],
            // description: ['', [
            //     Validators.required,
            //     Validators.minLength(config.models.tool.description.minlength),
            //     Validators.maxLength(config.models.tool.description.maxlength)
            // ]],
            // visibility: [config.models.tool.visibility.default, [
            //     Validators.required
            // ]],
        });
    }

    ngOnInit() { }

    ngOnDestroy() { }

    createNewTool(): void {
        let newTool = this.newForm.value;
        console.log(`Creating a new tool: ${JSON.stringify(newTool)}`);
        // TODO: Add the create method to our tool service
        // this.toolService.create(newTool)
        //     .subscribe(tool => {
        //         this.newTool.emit(tool);
        //     }, err => {
        //         console.log('ERROR', err);
        //         this.errors.newTool = err.message;
        //     });
    }
}
