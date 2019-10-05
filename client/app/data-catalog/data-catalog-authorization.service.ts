import { Injectable } from '@angular/core';
import { DataCatalog } from 'models/entities/data-catalog.model';
import { UserPermissionDataService } from 'components/auth/user-permission-data.service';
import { EntityAuthorizationService } from 'components/authorization/entity-authorization.service';
import { DataCatalogService } from './data-catalog.service';
import config from '../app.constants';

@Injectable()
export class DataCatalogAuthorizationService extends EntityAuthorizationService<DataCatalog> {
    // TODO Find a way to not have to inject the service in the child service, only the parent service.
    static parameters = [UserPermissionDataService, DataCatalogService];
    constructor(
        protected userPermissionDataService: UserPermissionDataService,
        protected entityService: DataCatalogService
    ) {
        super(userPermissionDataService, entityService);
    }

    getEntityType(): string {
        return config.entityTypes.DATA_CATALOG.value;
    }

    getCreateActionPermissionType(): string {
        return config.actionPermissionTypes.CREATE_DATA_CATALOG.value;
    }
}
