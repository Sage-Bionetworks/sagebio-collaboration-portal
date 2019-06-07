import { Component } from '@angular/core';
// import constants from '../../app/app.constants';
import config from '../../app/app.constants';

@Component({
    selector: 'app-footer',
    template: require('./footer.html'),
    styles: [require('./footer.scss')]
})
export class FooterComponent {
    gitVersion;
    gitBranch;

    constructor() {
        this.gitVersion = config.gitVersion;
        this.gitBranch = config.gitBranch;
        // version = `1.0.0 (${constants.BRANCH}-${constants.VERSION})`;
    }
}
