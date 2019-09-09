import { Resource } from './resource.model';
import { Tool } from '../tool.model';

export interface State extends Resource {
    data?: string;
    tool: Tool;
}
