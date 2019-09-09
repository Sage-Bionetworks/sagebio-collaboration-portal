export const authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    },
    hasRole(role) {
        return `authService.hasRole.${role}`;
    },
    // isAuthorized(requestedPermission) {
    //     return `authService.isAuthorized.${requestedPermission}`;
    // },
    // isAuthorizedForEntity(requestedPermission) {
    //     return `authService.isAuthorizedForEntity.${requestedPermission}`;
    // },
    // hasPermission(permission) {
    //     return `authService.hasPermission.${permission}`;
    // },
    // hasPermissionForEntity(allowedAccesses) {
    //     return `authService.hasPermissionForEntity.${allowedAccesses}`;
    // },
};
