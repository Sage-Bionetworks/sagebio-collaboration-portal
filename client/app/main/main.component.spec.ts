import { MaterialModule } from './../../components/material/material.module';
/* tslint:disable no-unused-expression */

import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from 'chai';
import { FormsModule } from '@angular/forms';
import { SocketService } from 'components/socket/socket.service';
import { SocketServiceStub } from 'components/socket/socket.mock';
import { PageTitleService } from 'components/page-title/page-title.service';
import { PageTitleServiceStub } from 'components/page-title/page-title.mock';
import { MainComponent } from './main.component';
import { SocketServiceMock } from '../../components/socket/socket.service.mock';
import { AuthServiceMock } from './../../components/auth/auth.service.mock';
import { AuthService } from '../../components/auth/auth.service';

describe('Component: MainComponent', function () {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;
    // let httpTestingController: HttpTestingController;
    // const mockThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express'];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule], // FormsModule, HttpClientTestingModule
            declarations: [MainComponent],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: PageTitleService, useClass: PageTitleServiceStub },
            ],
        }).compileComponents();

        // httpTestingController = TestBed.get(HttpTestingController);
    }));

    beforeEach(async(() => {
        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    // it('should instantiate', () => {
    //     expect(component).to.not.be.undefined;
    // });

    // it('should set the page title to empty', () => {

    // });

    // it('should attach a list of things to the controller', () => {
    //     // `GET /api/things` should be made once
    //     const req = httpTestingController.expectOne('/api/things');
    //     expect(req.request.method).to.equal('GET');
    //
    //     // Respond with mock data
    //     req.flush(mockThings);
    //
    //     // assert that there are no outstanding requests
    //     httpTestingController.verify();
    //
    //     expect(comp.awesomeThings).to.equal(mockThings);
    // });
});
