import { Agent } from './agent.model';
import { Reference } from './reference.model';

export interface Activity {
    name: string;
    class: ActivityClass;
    agents: Agent[];
    generated: Reference[];
    used: Reference[];
    description: string;
}

export enum ActivityClass {
    REPORT_CREATION = 'ReportCreation',
    MEMO_CREATION = 'MemoCreation',
    MENTION = 'Mention',
    TOOL_SESSION = 'ToolSession',
    RESOURCE_REGISTRATION = 'ResourceRegistration',
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ReferenceClass:
 *       type: string
 *       enum:
 *         - Insight
 *         - Resource
 */
export enum ReferenceClass {
    INSIGHT = 'Insight',
    RESOURCE = 'Resource',
    PROJECT = 'Project'
}
