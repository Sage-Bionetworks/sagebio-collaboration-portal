import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'components/auth/auth.service';
import { PageTitleService } from 'components/page-title/page-title.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-main',
    template: require('./main.html'),
    styles: [require('./main.scss')],
})
export class MainComponent implements OnInit, OnDestroy {
    private isLoggedIn = false; // used in html
    private authInfoSub: Subscription;

    static parameters = [AuthService, PageTitleService, MatDialog];
    constructor(private authService: AuthService, private pageTitleService: PageTitleService, private dialog: MatDialog) {}

    ngOnInit() {
        this.authInfoSub = this.authService.authInfo().subscribe(authInfo => {
            this.isLoggedIn = authInfo.isLoggedIn();
        });
        this.pageTitleService.title = '';
    }

    ngOnDestroy() {
        this.authInfoSub.unsubscribe();
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogContentExampleDialog);

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
    }
}

@Component({
    selector: 'dialog-content-example-dialog',
    template: require('./test-dialog.html'),
    // styles: [require('./main.scss')],
  })
  export class DialogContentExampleDialog {}
