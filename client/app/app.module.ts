import {
    NgModule,
    ApplicationRef,
    Provider
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { HttpErrorInterceptor } from '../components/http/http-error.interceptor';
import { JwtInterceptor } from '../components/http/jwt.interceptor';

import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer,
} from '@angularclass/hmr';

import { RouterModule, Routes } from '@angular/router';
import { NgxMdModule } from 'ngx-md';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../components/material/material.module';

import { AppComponent } from './app.component';
import { MainModule } from './main/main.module';
import { DatasetModule } from './dataset/dataset.module';
import { DataCatalogModule } from './data-catalog/data-catalog.module';
import { ProjectModule } from './project/project.module';
import { ToolModule } from './tool/tool.module';
import { InsightModule } from './insight/insight.module';
import { DiscussionModule } from './discussion/discussion.module';
import { StateModule } from './state/state.module';

import { DirectivesModule } from '../components/directives.module';
import { JwtModule } from '@auth0/angular-jwt';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';

export function tokenGetter() {
    return localStorage.getItem('access_token');  // was 'id_token'
}

let providers: Provider[] = [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
}, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true,
}];

const appRoutes: Routes = [{
    path: '',
    redirectTo: '/home', // was /home
    pathMatch: 'full'
}];

@NgModule({
    providers,
    imports: [
        BrowserModule,
        HttpClientModule,
        // JwtModule.forRoot({
        //     config: {
        //         tokenGetter,
        //     }
        // }),

        BrowserAnimationsModule,
        MaterialModule,
        NgxMdModule.forRoot(),

        RouterModule.forRoot(appRoutes, { enableTracing: process.env.NODE_ENV === 'development' }),
        MainModule,
        DatasetModule,
        DataCatalogModule,
        ProjectModule,
        ToolModule,
        InsightModule,
        DiscussionModule,
        StateModule,

        DirectivesModule,
        AccountModule,
        AdminModule,
    ],
    declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    static parameters = [ApplicationRef];
    constructor(private appRef: ApplicationRef) {
        this.appRef = appRef;
    }

    hmrOnInit(store) {
        if (!store || !store.state) return;
        console.log('HMR store', store);
        console.log('store.state.data:', store.state.data);
        // inject AppStore here and update it
        // this.AppStore.update(store.state)
        if ('restoreInputValues' in store) {
            store.restoreInputValues();
        }
        // change detection
        this.appRef.tick();
        Reflect.deleteProperty(store, 'state');
        Reflect.deleteProperty(store, 'restoreInputValues');
    }

    hmrOnDestroy(store) {
        var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // inject your AppStore and grab state then set it on store
        // var appState = this.AppStore.get()
        store.state = { data: 'yolo' };
        // store.state = Object.assign({}, appState)
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        Reflect.deleteProperty(store, 'disposeOldHosts');
        // anything you need done the component is removed
    }
}
