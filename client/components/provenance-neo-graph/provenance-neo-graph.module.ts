import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'components/material/material.module';
import { ProvenanceNeoGraphService } from './provenance-neo-graph.service';
import { ProvenanceNeoGraphComponent } from './provenance-neo-graph.component';
import { ProvenanceSidenavComponent } from './provenance-sidenav/provenance-sidenav.component';


@NgModule({
    imports: [
        BrowserModule,
        MaterialModule,
    ],
    declarations: [
        ProvenanceNeoGraphComponent,
        ProvenanceSidenavComponent
    ],
    providers: [
        ProvenanceNeoGraphService,
        ProvenanceSidenavComponent
    ],
    exports: [
        ProvenanceNeoGraphComponent,
        ProvenanceSidenavComponent
    ]
})
export class ProvenanceNeoGraphModule { }
