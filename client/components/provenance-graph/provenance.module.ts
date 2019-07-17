import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'components/material/material.module';
import { ProvenanceGraphService } from './provenance-graph.service';
import { ProvenanceGraphComponent } from './provenance-graph.component';
import { ProvenanceSidenavComponent } from './provenance-sidenav/provenance-sidenav.component';


@NgModule({
    imports: [
        BrowserModule,
        MaterialModule,
    ],
    declarations: [
        ProvenanceGraphComponent,
        ProvenanceSidenavComponent
    ],
    providers: [
        ProvenanceGraphService,
        ProvenanceSidenavComponent
    ],
    exports: [
        ProvenanceGraphComponent,
        ProvenanceSidenavComponent
    ]
})
export class ProvenanceModule { }
