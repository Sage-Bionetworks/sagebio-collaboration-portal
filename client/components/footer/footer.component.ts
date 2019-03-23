import { Component } from '@angular/core';
import { gitVersion, gitBranch } from '../../app/app.constants';

@Component({
    selector: 'footer',
    template: require('./footer.html'),
    styles: [require('./footer.scss')]
})
export class FooterComponent {
    gitVersion;
    gitBranch;

    constructor() {
        this.gitVersion = gitVersion;
        this.gitBranch = gitBranch;
    }
}
