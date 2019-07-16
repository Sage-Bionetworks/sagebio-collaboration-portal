import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ProvenanceGraphService } from './provenance-graph.service';
import { ProvenanceGraphComponent } from './provenance-graph.component';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        ProvenanceGraphComponent
    ],
    providers: [
        ProvenanceGraphService
    ],
    exports: [
        ProvenanceGraphComponent
    ]
})
export class ProvenanceModule { }
