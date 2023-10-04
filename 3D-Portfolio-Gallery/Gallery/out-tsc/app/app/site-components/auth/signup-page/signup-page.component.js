import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserNewDTO } from "../../../shared/class/dto/UserNewDTO";
import { UserLoginDTO } from "../../../shared/class/dto/UserLoginDTO";
let SignupPageComponent = class SignupPageComponent {
    constructor(navbar, footer, auth, router) {
        this.navbar = navbar;
        this.footer = footer;
        this.auth = auth;
        this.router = router;
        this.signupForm = new FormGroup({
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.email, Validators.required]),
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required),
        }, [CustomValidators.MatchValidator('password', 'confirmPassword')]);
    }
    get passwordMatchError() {
        return (this.signupForm.getError('mismatchError') &&
            this.signupForm.get('confirmPassword')?.touched);
    }
    ngOnInit() {
        this.navbar.hide();
        this.navbar.changeWhite();
        this.footer.hide();
    }
    onSubmit() {
        if (this.signupForm.valid) {
            const email = this.signupForm.value.email;
            const name = this.signupForm.value.username;
            const password = this.signupForm.value.password;
            this.auth.newUsers(new UserNewDTO(name, email, "https://randomuser.me/api/portraits/women/7.jpg", password))
                .subscribe({
                next: value => {
                    this.auth.login(new UserLoginDTO(name, password)).subscribe({
                        next: value1 => {
                            this.auth.setSaveJWT(value1);
                            this.router.navigateByUrl('/profile');
                        },
                        error: err => {
                            this.auth.logout();
                            //Todo - error msg
                        }
                    });
                },
                error: value => {
                    // TODO - Error Msg
                }
            });
        }
    }
};
SignupPageComponent = __decorate([
    Component({
        selector: 'app-signup-page',
        templateUrl: './signup-page.component.html',
        styleUrls: ['./signup-page.component.scss']
    })
], SignupPageComponent);
export { SignupPageComponent };
export class CustomValidators {
    static MatchValidator(source, target) {
        return (control) => {
            const sourceCtrl = control.get(source);
            const targetCtrl = control.get(target);
            return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
                ? { mismatchError: true }
                : null;
        };
    }
}
//# sourceMappingURL=signup-page.component.js.map