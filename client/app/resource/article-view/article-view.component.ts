import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
// import { ResourceService } from '../resource.service';
import { Article } from 'models/entities/resources/article.model';

@Component({
    selector: 'article-view',
    template: require('./article-view.html'),
    styles: [require('./article-view.scss')],
})
export class ArticleViewComponent {
    private _article: Article;

    static parameters = [Router];
    constructor(private router: Router) { }

    get article() {
        return this._article;
    }

    @Input()
    set article(article) {
        this._article = article;
        console.log('ARTICLE', article);
    }
}
