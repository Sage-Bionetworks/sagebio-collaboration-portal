import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Thread } from 'models/messaging/thread.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';

import config from '../../../app/app.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObjectValidators } from './../../validation/object-validators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'thread-edit',
    template: require('./thread-edit.html'),
    styles: [require('./thread-edit.scss')],
})
export class ThreadEditComponent implements OnInit {
    @Input() thread: Thread;
    @Output() editThread: EventEmitter<Thread> = new EventEmitter<Thread>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    private canEditThread = false;
    private form: FormGroup;
    private threadSpecs: object;
    private errors = {
        editThreadTitle: undefined,
    };

    static parameters = [FormBuilder, UserPermissionDataService];
    constructor(private formBuilder: FormBuilder, private userPermissionDataService: UserPermissionDataService) {
        this.threadSpecs = config.models.message;
        this.form = formBuilder.group({
            title: [
                '',
                [
                    Validators.required,
                    ObjectValidators.jsonStringifyMinLength(config.models.message.title.minlength),
                    ObjectValidators.jsonStringifyMaxLength(config.models.message.title.maxlength),
                ],
            ],
        });
        this.userPermissionDataService.permissions().subscribe(permissions => {
            // Eventually permissions should be implemented for user editing of messages
            this.canEditThread = permissions.isAdmin();
        });
    }

    ngOnInit() {
        this.form.controls.title.valueChanges
            .pipe(
                debounceTime(50),
                distinctUntilChanged()
            )
            .subscribe(data => {
                this.errors.editThreadTitle = undefined;
            });
    }

    updateThread() {
        this.editThread.emit();
        this.form.reset();
    }
}
