import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthInterceptor = class AuthInterceptor {
    constructor() { }
    intercept(request, next) {
        const idToken = localStorage.getItem('id_token');
        if (idToken) {
            const cloned = request.clone({
                headers: request.headers.set('Authorization', 'Bearer '.concat(idToken))
            });
            return next.handle(cloned);
        }
        return next.handle(request);
    }
};
AuthInterceptor = __decorate([
    Injectable()
], AuthInterceptor);
export { AuthInterceptor };
//# sourceMappingURL=auth.interceptor.js.map