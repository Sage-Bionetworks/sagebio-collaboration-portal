import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataCatalogAuthorizationService } from './data-catalog-authorization.service';
import { EntityGuard } from 'components/authorization/entity-guard.service';
import { DataCatalog } from 'models/entities/data-catalog.model';

@Injectable()
export class DataCatalogGuard extends EntityGuard<DataCatalog> {
    static parameters = [Router, DataCatalogAuthorizationService];
    constructor(protected router: Router, protected authorizationService: DataCatalogAuthorizationService) {
        super(router, authorizationService);
    }

    falsyRedirectUrl(): string[] {
        return ['/', 'data-catalogs'];
    }
}
