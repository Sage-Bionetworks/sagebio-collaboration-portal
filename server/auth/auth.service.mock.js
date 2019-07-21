export const authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    },
    isAuthorized(requestedPermission) {
        return `authService.isAuthorized.${requestedPermission}`;
    },
    isAuthorizedForEntity(requestedPermission) {
        return `authService.isAuthorizedForEntity.${requestedPermission}`;
    },
    hasPermission(permission) {
        return `authService.hasPermission.${permission}`;
    },
    hasPermissionForEntity(permission) {
        return `authService.hasPermissionForEntity.${permission}`;
    },
    hasRole(role) {
        return `authService.hasRole.${role}`;
    },
};
