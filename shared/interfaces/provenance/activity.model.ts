import { Agent } from './agent.model';
import { Reference } from './reference.model';

export interface Activity {
    name: string;
    class: string;
    agents: Agent[];
    generated: Reference[];
    used: Reference[];
    description: string;
}
