export interface ProvenanceNode {
  id: string,
  labels: NodeLabel[],
  properties: ProvenanceNodeProperties,
}

export interface ProvenanceNodeProperties {
  class: string,
  createdAt: string,
  id: string,
  name: string,
  subclass: string,
  targetId?: string,
  userId?: string,
  targetVersionId: number
}

export enum NodeLabel {
  Activity = 'Activity',
  Reference = 'Reference',
  Agent = 'Agent',
}