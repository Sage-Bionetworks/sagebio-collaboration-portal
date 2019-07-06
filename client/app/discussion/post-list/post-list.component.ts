import { Component, OnInit, AfterViewInit, ViewChild, ViewChildren, ContentChildren, QueryList, forwardRef } from '@angular/core';
import { PageTitleService } from 'components/page-title/page-title.service';
import { Tag } from 'models/tag.model';
import { TagService } from 'components/tag/tag.service';

@Component({
    selector: 'post-list',
    template: require('./post-list.html'),
    styles: [require('./post-list.scss')],
})
export class PostListComponent implements OnInit, AfterViewInit {
    private tags: Tag[] = [];

    static parameters = [PageTitleService, TagService];
    constructor(private pageTitleService: PageTitleService,
        private tagService: TagService) {
        this.tagService.getTags()
            .subscribe(tags => this.tags = tags);
    }

    ngOnInit() {
        this.pageTitleService.title = 'Discussion';
    }

    ngAfterViewInit() {
    }
}
