import { EntityPermission } from 'models/auth/entity-permission.model';
import { Project } from 'models/entities/project.model';

export interface InviteBundle {
    invite: EntityPermission;
    project: Project;
}
