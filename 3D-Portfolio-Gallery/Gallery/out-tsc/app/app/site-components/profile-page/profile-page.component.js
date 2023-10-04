import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { ExhibitionUser } from "../../shared/class/exhibition-user";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
let ProfilePageComponent = class ProfilePageComponent {
    constructor(navbar, footer, gallery_service, authService, matDialog) {
        this.navbar = navbar;
        this.footer = footer;
        this.gallery_service = gallery_service;
        this.authService = authService;
        this.matDialog = matDialog;
        this.isDeleteMode = false;
        this.reloadPage();
    }
    reloadPage() {
        const userId = localStorage.getItem('user_id') ?? '';
        this.authService.getUser(userId).subscribe(user => {
            this.user = user;
            this.authService.getUserExhibtions(userId).subscribe(exhibitionList => {
                this.exhibition_list = exhibitionList.map(exhibition => { return new ExhibitionUser(exhibition, user?.icon_url ?? '', user?.user_name ?? 'you'); });
            });
        });
    }
    ngOnInit() {
        this.navbar.show();
        this.footer.show();
    }
    onDelete() {
        this.isDeleteMode = !this.isDeleteMode;
    }
    //Todo add server remove; add "are your sure?" prompt
    //deleteExhibtionEvent(e: Exhibition) {
    //  this.exhibition_list?.splice(this.exhibition_list?.indexOf(e), 1)
    // }
    deleteExhibtionEvent(exhibition) {
        this.matDialog.open(DeleteDialogComponent, {
            width: '250px',
            enterAnimationDuration: '500ms',
            exitAnimationDuration: '500ms',
            data: { exhibition_name: exhibition.title }
        }).afterClosed().subscribe(result => {
            console.log("Result of Dialog", result);
            if (result) {
                console.log("deleting Exhibition", exhibition.id, exhibition.title);
                this.gallery_service.deleteExhibition(exhibition.id).subscribe(value => { console.log("Successful deletion: ", value); this.reloadPage(); }, error => { console.error("There was an error while deleting the exhibition", error); });
            }
        });
    }
};
ProfilePageComponent = __decorate([
    Component({
        selector: 'app-profile-page',
        templateUrl: './profile-page.component.html',
        styleUrls: ['./profile-page.component.scss']
    })
], ProfilePageComponent);
export { ProfilePageComponent };
let DeleteDialogComponent = class DeleteDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
};
DeleteDialogComponent = __decorate([
    Component({
        selector: 'dialog-delete-dialog',
        templateUrl: 'dialog-delete.component.html',
    }),
    __param(1, Inject(MAT_DIALOG_DATA))
], DeleteDialogComponent);
export { DeleteDialogComponent };
//# sourceMappingURL=profile-page.component.js.map