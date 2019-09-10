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

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityClass:
 *       type: string
 *       enum:
 *         - Insight
 *         - Resource
 */
export enum ActivityClass {
    INSIGHT = 'Insight',
    RESOURCE = 'Resource'
}
