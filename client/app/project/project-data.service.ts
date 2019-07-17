import { Injectable } from '@angular/core';
import { AuthService } from 'components/auth/auth.service';
import config from '../../app/app.constants';

@Injectable()
export class ProjectDataService {

    static parameters = [AuthService];
    constructor(private authService: AuthService) { }
}
