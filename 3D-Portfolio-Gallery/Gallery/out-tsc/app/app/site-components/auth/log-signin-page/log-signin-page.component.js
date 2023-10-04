import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserLoginDTO } from "../../../shared/class/dto/UserLoginDTO";
let LogSigninPageComponent = class LogSigninPageComponent {
    constructor(navbar, footer, auth, router) {
        this.navbar = navbar;
        this.footer = footer;
        this.auth = auth;
        this.router = router;
        this.showLogginError = false;
        this.loginForm = new FormGroup({
            emailOrUsername: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }
    ngOnInit() {
        this.navbar.hide();
        this.navbar.changeWhite();
        this.footer.hide();
    }
    onSubmit() {
        if (this.loginForm.valid) {
            this.auth.login(new UserLoginDTO(this.loginForm.value.emailOrUsername ?? '', this.loginForm.value.password ?? '')).subscribe({
                next: value => {
                    this.auth.setSaveJWT(value);
                    this.router.navigateByUrl('/profile');
                },
                error: err => {
                    this.showLogginError = true;
                    this.auth.logout();
                }
            });
        }
    }
};
LogSigninPageComponent = __decorate([
    Component({
        selector: 'app-log-signin-page',
        templateUrl: './log-signin-page.component.html',
        styleUrls: ['./log-signin-page.component.scss']
    })
], LogSigninPageComponent);
export { LogSigninPageComponent };
//# sourceMappingURL=log-signin-page.component.js.map