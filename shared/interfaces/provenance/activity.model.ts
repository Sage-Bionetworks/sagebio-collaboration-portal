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
    RESOURCE_GENERATION = 'ResourceGeneration',
    MEMOIZATION = 'Memoization',
    MENTION = 'Mention',
    TOOL_SESSION = 'ToolSession'
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
    RESOURCE = 'Resource'
}
