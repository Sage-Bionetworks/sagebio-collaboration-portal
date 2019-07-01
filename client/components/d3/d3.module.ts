import { NgModule } from '@angular/core';
import { D3Service } from './d3.service';
import { D3_DIRECTIVES } from './directives';

@NgModule({
    imports: [

    ],
    declarations: [
        ...D3_DIRECTIVES
    ],
    providers: [
        D3Service
    ],
    exports: [
        ...D3_DIRECTIVES
    ]
})
export class D3Module { }
