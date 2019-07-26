import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { D3Module } from '../d3/d3.module';
import { ProvenanceService } from './provenance.service';
import { ProvenanceGraphComponent } from './provenance-graph/provenance-graph.component';
import { ProvenanceNodeComponent } from './provenance-graph/provenance-node/provenance-node.component';
import { ActivityNodeComponent } from './provenance-graph/activity-node/activity-node.component';
import { ReferenceNodeComponent } from './provenance-graph/reference-node/reference-node.component';
import { AgentNodeComponent } from './provenance-graph/agent-node/agent-node.component';
import { ProvenanceLinkComponent } from './provenance-graph/provenance-link/provenance-link.component';

@NgModule({
    imports: [
        BrowserModule,
        D3Module
    ],
    providers: [
        ProvenanceService,
        ProvenanceGraphComponent,
        ProvenanceNodeComponent,
        ProvenanceLinkComponent
    ],
    declarations: [
        ProvenanceGraphComponent,
        ProvenanceNodeComponent,
        ProvenanceLinkComponent,
        ActivityNodeComponent,
        ReferenceNodeComponent,
        AgentNodeComponent
    ],
    exports: [
        ProvenanceGraphComponent,
        ProvenanceNodeComponent,
        ProvenanceLinkComponent
    ]
})
export class ProvenanceModule { }
