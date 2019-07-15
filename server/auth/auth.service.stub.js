export const authServiceStub = {
    isAuthenticated() {
        return 'authService.isAuthenticated';
    },
    hasRole(role) {
        return `authService.hasRole.${role}`;
    },
    hasPermission(permission) {
        return `authService.hasPermission.${permission}`;
    }
};
