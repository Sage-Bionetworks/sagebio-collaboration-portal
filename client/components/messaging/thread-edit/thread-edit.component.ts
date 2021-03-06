import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Thread } from 'models/messaging/thread.model';
import { UserService } from 'components/auth/user.service';
import { MessagingService } from 'components/messaging/messaging.service';

import config from '../../../app/app.constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObjectValidators } from './../../validation/object-validators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'thread-edit',
    template: require('./thread-edit.html'),
    styles: [require('./thread-edit.scss')],
})
export class ThreadEditComponent implements OnInit {
    @Input() thread: Thread;
    @Output() threadEdit: EventEmitter<Thread> = new EventEmitter<Thread>();
    @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

    private userId: string;
    private form: FormGroup;
    private threadSpecs: any;
    private errors = {
        editThreadTitle: undefined,
    };

    static parameters = [FormBuilder, UserService, MessagingService];
    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private messagingService: MessagingService
    ) {
        this.threadSpecs = config.models.thread;
        this.form = formBuilder.group({
            title: [
                '',
                [
                    Validators.required,
                    ObjectValidators.jsonStringifyMinLength(this.threadSpecs.title.minlength),
                    ObjectValidators.jsonStringifyMaxLength(this.threadSpecs.title.maxlength),
                ],
            ],
        });

        // Get the current user ID
        this.userService.get().subscribe(user => {
            this.userId = user._id;
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
        let updatedThread = cloneDeep(this.thread);
        updatedThread.title = this.form.controls.title.value;

        this.messagingService.updateThread(updatedThread).subscribe(
            thread => {
                this.threadEdit.emit(thread);
            },
            err => {
                console.error(err);
                this.errors.editThreadTitle = err.message || err;
            }
        );

        // let editedThread = this.form.value;
        // editedThread._id = this.thread._id;
        // editedThread.updatedBy = this.userId;

        // this.messagingService.updateThread(editedThread).subscribe(
        //     thread => {
        //         this.editThread.emit(thread);
        //         this.form.reset();
        //     },
        //     err => {
        //         console.error(err);
        //         this.errors.editThreadTitle = err.message || err;
        //     }
        // );
    }
}
