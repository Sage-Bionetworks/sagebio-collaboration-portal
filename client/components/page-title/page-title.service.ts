import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

/**
 * Service responsible for setting the title that appears above the components
 * and guide pages.
 */
@Injectable()
export class PageTitleService {
    _title = '';
    _numNotifications = 0;

    static parameters = [Title];
    constructor(private bodyTitle: Title) { }

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
        this.renderTitle();
    }

    get numNotifications(): number {
        return this._numNotifications;
    }

    set numNotifications(numNotifications: number) {
        this._numNotifications = numNotifications;
        this.renderTitle();
    }

    renderTitle(): void {
        const title = (this._title !== '') ? `${this._title} | ` : '';
        const notification = (this._numNotifications > 0) ? `(${this._numNotifications}) ` : '';
        this.bodyTitle.setTitle(`${notification}${title}PHCCP`);
    }
}
