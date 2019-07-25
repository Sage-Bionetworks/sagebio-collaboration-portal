import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { includes } from 'lodash';
import { neoJson } from '../provenance-neo-graph/temporal-mock-data/smallMockGraphNeo'
import { Node } from 'components/d3/models/node';
import { Link } from 'components/d3/models/link';

@Injectable()
export class ProvenanceService {

    static parameters = [HttpClient];
    constructor(private httpClient: HttpClient) { }

    getProvenanceGraph(sortBy: string, order: string, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('sortBy', sortBy)
            .set('order', order)
            .set('limit', String(limit));
        return this.httpClient.get<any>(`/api/provenance`, {params});
    }

    getProvenanceGraphByAgent(agentId: string, sortBy: string, order: string, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('sortBy', sortBy)
            .set('order', order)
            .set('limit', String(limit));
        return this.httpClient.get<any>(`/api/provenance/byAgent/${agentId}`, {params});
    }

    getProvenanceGraphByReference(referenceId: string, direction: string, sortBy: string, order: string, limit: number): Observable<any> {
        let params = new HttpParams()
            .set('direction', direction)
            .set('sortBy', sortBy)
            .set('order', order)
            .set('limit', String(limit));
        return this.httpClient.get<any>(`/api/provenance/byReference/${referenceId}`, {params});
    }

    // TODO: testing purposes, remove after connecting to backend
    getMockedNodesAndRelationsForProvenanceGraph() {
        const graph = {
            nodes: [],
            relationships: []
        };

        neoJson.results.forEach(function(result) {
            result.data.forEach(function(data) {
                data.graph.nodes.forEach(function(node) {
                    if (!includes(graph.nodes, node.id)) {
                        graph.nodes.push(new Node(node.id, node.labels[0], node.properties._class, node.properties.subclass));
                    }
                });

                data.graph.relationships.forEach(function(relationship) {
                    relationship.source = relationship.startNode;
                    relationship.target = relationship.endNode;
                    graph.relationships.push(new Link(relationship.source, relationship.target, relationship));
                });

                data.graph.relationships.sort(function(a, b) {
                    if (a.source > b.source) {
                        return 1;
                    } else if (a.source < b.source) {
                        return -1;
                    } else {
                        if (a.target > b.target) {
                            return 1;
                        }

                        if (a.target < b.target) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });

                for (var i = 0; i < data.graph.relationships.length; i++) {
                    if (i !== 0 && data.graph.relationships[i].source === data.graph.relationships[i-1].source && data.graph.relationships[i].target === data.graph.relationships[i-1].target) {
                        data.graph.relationships[i].linknum = data.graph.relationships[i - 1].linknum + 1;
                    } else {
                        data.graph.relationships[i].linknum = 1;
                    }
                }
            });
        });
        return graph;
    }
}
