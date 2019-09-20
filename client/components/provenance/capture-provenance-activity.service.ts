import { Injectable } from '@angular/core';
import { AuthService } from 'components/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'models/auth/user.model';
import { ProvenanceService } from './provenance.service';

@Injectable()
export class CaptureProvenanceActivityService {
    authInfoSub: Subscription;
    currentUser: User;

    static parameters = [AuthService, ProvenanceService];
    constructor(private authService: AuthService, private provenanceService: ProvenanceService) {
        this.authInfoSub = this.authService.authInfo()
            .subscribe(authInfo => {
                this.currentUser = authInfo.user;
            }, err => console.log(err));

    }

    save({ generatedName, generatedTargetId, generatedClass, generatedSubClass, usedEntities }) { // TODO use usedEntities
        const activity = {
            agents: [{
                userId: this.currentUser._id,
                name: this.currentUser.name,
                role: this.currentUser.role,
            }],
            description: '',
            class: 'Report generation', // TODO set from generatedSubClass
            generated: [{
                name: generatedName,
                role: '',
                targetId: generatedTargetId,
                targetVersionId: '1',
                class: generatedClass,
                subclass: generatedSubClass,
            }],
            name: `Creation of ${generatedName}`,
            used: usedEntities
            // used: [{
            //     name: '',
            //     role: '',
            //     targetId: '',
            //     targetVersionId: '1',
            //     class: '',
            //     subclass: ''
            // }]
        };

        this.provenanceService.createProvenanceActivity(activity)
            .subscribe(provenanceActivity => { /* Successfully created provenance activity */ },
                (err => {
                    console.error('Unable to create a provenance activity:', err);
                })
            );
    }
}
