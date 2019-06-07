import { Type } from '@angular/core';

export class SidenavItem {
    constructor(public component: Type<any>, public data: any) { }
}
