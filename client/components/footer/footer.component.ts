import { Component } from '@angular/core';
// import constants from '../../app/app.constants';
import { gitVersion, gitBranch } from '../../app/app.constants';

@Component({
    selector: 'app-footer',
    template: require('./footer.html'),
    styles: [require('./footer.scss')]
})
export class FooterComponent {
    gitVersion;
    gitBranch;

    constructor() {
        this.gitVersion = gitVersion;
        this.gitBranch = gitBranch;
        // version = `1.0.0 (${constants.BRANCH}-${constants.VERSION})`;
    }
}
