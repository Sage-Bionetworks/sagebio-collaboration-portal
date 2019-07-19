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
        D3Module
    ],
    providers: [
        ProvenanceService,
        ProvenanceGraphComponent,
        ActivityNodeComponent,
        ProvenanceLinkComponent
    ],
    declarations: [
        ProvenanceGraphComponent,
        ActivityNodeComponent,
        ProvenanceLinkComponent
    ],
    exports: [
        ProvenanceGraphComponent,
        ActivityNodeComponent,
        ProvenanceLinkComponent
    ]
})
export class ProvenanceModule { }
