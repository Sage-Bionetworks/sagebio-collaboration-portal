import { Injectable } from '@angular/core';
import { AuthService } from 'components/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'models/auth/user.model';
import { ProvenanceService } from 'components/provenance/provenance.service';

@Injectable()
export class ActivityService {
    authInfoSub: Subscription;
    currentUser: User;

    static parameters = [AuthService, ProvenanceService];
    constructor(private authService: AuthService, private provenanceService: ProvenanceService) {
        this.authInfoSub = this.authService.authInfo().subscribe( // TODO unsubscribe
            authInfo => {
                this.currentUser = authInfo.user;
            },
            err => console.error(err)
        );
    }

    // TODO Add input and output types
    save({ generatedName, generatedTargetId, generatedClass, generatedSubClass, usedEntities = [] }): Observable<any> {
        const activity = {
            agents: [
                {
                    userId: this.currentUser._id,
                    name: this.currentUser.name,
                    role: this.currentUser.role,
                },
            ],
            description: '',
            class: 'Report generation', // TODO set from generatedSubClass
            generated: [
                {
                    name: generatedName,
                    role: '',
                    targetId: generatedTargetId,
                    targetVersionId: '1',
                    class: generatedClass,
                    subclass: generatedSubClass,
                },
            ],
            name: `Creation of ${generatedName}`,
            used: usedEntities,
        };

        return this.provenanceService.createProvenanceActivity(activity);
    }

    // inferActivityClass(generatedClass, generatedSubClass): string {

    // }
}
