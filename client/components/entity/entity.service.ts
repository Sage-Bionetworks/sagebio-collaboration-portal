import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    switchMap,
    tap
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Project } from 'models/entities/project.model';
import { Patch } from 'models/patch.model';
import { stringifyQuery } from 'components/util';
import { some, orderBy, head } from 'lodash/fp';
import { EntityVisibility, Entity } from 'models/entities/entity.model';

@Injectable()
export abstract class EntityService<E extends Entity> {

    /**
     * Makes an entity public.
     * @param entity
     */
    abstract makePublic(entity: E): Observable<E>;

    /**
     * Makes an entity private.
     * @param entity
     */
    abstract makePrivate(entity: E): Observable<E>;
  }