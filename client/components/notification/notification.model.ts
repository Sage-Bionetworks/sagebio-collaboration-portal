export class Notification {
    type: NotificationType;
    message: string;
    action: string;
}
export enum NotificationType {
    Success = 'success',
    Error = 'error',
    Info = 'info',
    Warning = 'warning'
}
