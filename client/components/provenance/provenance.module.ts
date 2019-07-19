import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { D3Module } from '../d3/d3.module';
import { ProvenanceService } from './provenance.service';
import { ProvenanceGraphComponent } from './provenance-graph/provenance-graph.component';
import { ActivityNodeComponent } from './provenance-graph/activity-node/activity-node.component';
import { ProvenanceLinkComponent } from './provenance-graph/provenance-link/provenance-link.component';

@NgModule({
    imports: [
        BrowserModule,
        // MaterialModule
        D3Module
    ],
    providers: [
        ProvenanceService
    ],
    declarations: [
        ProvenanceGraphComponent,
        ActivityNodeComponent,
        ProvenanceLinkComponent
    ],
    exports: [
        ProvenanceGraphComponent
    ]
})
export class ProvenanceModule { }
