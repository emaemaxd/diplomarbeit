import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let AuthService = class AuthService {
    constructor(http, router) {
        this.http = http;
        this.router = router;
        this.SERVER_URL = 'https://student.cloud.htl-leonding.ac.at/e.halilovic/api/';
    }
    getUser(userId) {
        return this.http.get(this.SERVER_URL + "users/" + userId);
    }
    login(user) {
        return this.http.post(this.SERVER_URL + "users/login", user, { responseType: 'text' });
    }
    newUsers(userNewDTO) {
        return this.http.post(this.SERVER_URL + "users/new", userNewDTO);
    }
    isLoggedIn() {
        if (localStorage.getItem('id_token') && localStorage.getItem('expires_at')) {
            let temp = new Date().getTime();
            const exp = Number(localStorage.getItem('expires_at'));
            return temp < exp;
        }
        else {
            return false;
        }
    }
    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('user_id');
    }
    setSaveJWT(value) {
        let decodedJWTPayload = JSON.parse(atob(value.split('.')[1]));
        localStorage.setItem("user", decodedJWTPayload.sub);
        localStorage.setItem('id_token', value);
        localStorage.setItem('expires_at', decodedJWTPayload.exp);
        localStorage.setItem('user_id', decodedJWTPayload.userid);
    }
    getUserExhibtions(userId) {
        return this.http.get(this.SERVER_URL + "exhibitions/getByUserId/" + userId);
    }
};
AuthService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map