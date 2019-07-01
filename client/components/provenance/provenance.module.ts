import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { MaterialModule } from '../../components/material/material.module';
import { D3Module } from '../d3/d3.module';
import { ProvenanceGraphService } from './provenance-graph/provenance-graph.service';
import { ProvenanceGraphComponent } from './provenance-graph/provenance-graph.component';
import { ActivityNodeComponent } from './provenance-graph/activity-node/activity-node.component';
import { ProvenanceLinkComponent } from './provenance-graph/provenance-link/provenance-link.component';

@NgModule({
    imports: [
        BrowserModule,
        // MaterialModule
        D3Module
    ],
    declarations: [
        ProvenanceGraphComponent,
        ActivityNodeComponent,
        ProvenanceLinkComponent
    ],
    providers: [
        ProvenanceGraphService
    ],
    exports: [
        ProvenanceGraphComponent
    ]
})
export class ProvenanceModule { }
