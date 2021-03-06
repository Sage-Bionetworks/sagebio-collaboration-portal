/* tslint:disable no-unused-expression */

import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from 'chai';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { HAMMER_LOADER } from '@angular/platform-browser';

import { ActivitySidenavComponent } from './activity-sidenav.component';
import { UserRole, User } from '../../../../shared/interfaces/auth/user.model';
import { Entity, EntityVisibility } from '../../../../shared/interfaces/entities/entity.model';
import { MaterialModule } from '../../../components/material/material.module';
import { FiltersModule } from '../../../components/filters/filters.module';
import { SecondarySidenavService } from '../../../components/sidenav/secondary-sidenav/secondary-sidenav.service';
import { ProvenanceService } from '../../../components/provenance/provenance.service';
import { SocketService } from '../../../components/socket/socket.service';
import { ProvenanceServiceMock } from './../../provenance/provenance.service.mock';
import { SecondarySidenavServiceMock } from './../../sidenav/secondary-sidenav/secondary-sidenav.service.mock';
import { SocketServiceMock } from './../../socket/socket.service.mock';

describe('ActivitySidenavComponent', () => {
    let component: ActivitySidenavComponent;
    let fixture: ComponentFixture<ActivitySidenavComponent>;

    let entity: Entity = {
        _id: '1',
        title: '',
        description: '',
        picture: '',
        visibility: EntityVisibility.PUBLIC,
        createdAt: '',
        createdBy: undefined,
    };

    let user: User = {
        email: '',
        position: '',
        orcid: '',
        name: 'test user',
        username: 'test',
        role: UserRole.USER,
        createdAt: '',
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActivitySidenavComponent],
            imports: [MaterialModule, CommonModule, RouterTestingModule, FiltersModule],
            providers: [
                { provide: ProvenanceService, useClass: ProvenanceServiceMock },
                { provide: SecondarySidenavService, useClass: SecondarySidenavServiceMock },
                { provide: SocketService, useClass: SocketServiceMock },
                {
                    provide: HAMMER_LOADER, // this provider prevents warnings in the console regarding missing hammer.js module
                    useValue: () => new Promise(() => {}),
                },
            ],
            // this schema prevents error in the console for missing child component allowing us to shallow render the component
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActivitySidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should instantiate', () => {
        expect(component).to.not.be.undefined;
    });

    // describe('#setRoot', () => {
    //     it('should get provenance graph by agent if entity is a user', () => {
    //         component.setRoot(user);
    //         fixture.detectChanges();
    //         const provenanceService: ProvenanceServiceMock = fixture.debugElement.injector.get(
    //             ProvenanceService
    //         ) as any;
    //         expect(provenanceService.getProvenanceGraphByAgent.calledOnce).to.be.true;
    //         expect(provenanceService.getProvenanceGraphByReference.calledOnce).to.be.false;
    //     });

    //     it('should get provenance graph by reference if entity is NOT a user', () => {
    //         component.setRoot(entity);
    //         fixture.detectChanges();
    //         const provenanceService: ProvenanceServiceMock = fixture.debugElement.injector.get(
    //             ProvenanceService
    //         ) as any;
    //         expect(provenanceService.getProvenanceGraphByReference.calledOnce).to.be.true;
    //         expect(provenanceService.getProvenanceGraphByAgent.calledOnce).to.be.false;
    //     });
    // });

    describe('#checkIfUser', () => {
        it('should return true if the entity is a user', () => {
            expect(component.checkIfUser(user)).to.be.true;
        });
        it('should return false if the entity is NOT a user', () => {
            expect(component.checkIfUser(entity)).to.be.false;
        });
    });

    it('should close the sidenav if the close button is clicked', () => {
        const button = fixture.debugElement.nativeElement.querySelector('.app-activity-header-close');
        button.click();

        const sidenavService: SecondarySidenavServiceMock = fixture.debugElement.injector.get(
            SecondarySidenavService
        ) as any;
        expect(sidenavService.close.calledOnce).to.be.true;
    });

    it('should NOT render filter radio buttons if the entity is a user', () => {
        component.setRoot(user);
        fixture.detectChanges();
        const filtersContainer = fixture.debugElement.nativeElement.querySelector('.app-activity-filters-container');
        expect(filtersContainer).to.be.null;
    });

    it('should render filter radio buttons if the entity is NOT a user', () => {
        component.setRoot(entity);
        fixture.detectChanges();
        const filtersContainer = fixture.debugElement.nativeElement.querySelector('.app-activity-filters-container');
        expect(filtersContainer).to.not.be.null;
    });
});
