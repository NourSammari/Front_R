import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { MatDialog } from '@angular/material/dialog';
import { EditInfosComponent } from 'app/modules/admin/profile/EditInfos/labels.component';
import { EditExperienceComponent } from 'app/modules/admin/profile/EditExperience/labels.component';
import { UserService } from 'app/Services/user-service.service';
import { UsersDetails  } from 'app/Model/user';
import { UserData } from 'app/Model/session';


@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass],
})
export class ProfileComponent
{
    user: any;

    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    UserId = this.userData.data.user.ID || '';
    CompanyId = this.userData.data.user.workCompanyId || '';
    /**
     * Constructor
     */
    constructor(private _matDialog: MatDialog,
        private userService: UserService,
        )
    {
    }

    ngOnInit(): void {

        this.fetchUser();
        /*setInterval(() => {
        this.fetchUser();
    }, 5000);*/
    }

    fetchUser(): void {
        console.log('Fetching user...');
        this.userService.getUser(this.CompanyId, this.UserId).subscribe(
            response => {


                // Ensure that the structure of response.data matches your expectations
                if (response.data && response.data.email) {
                    this.user = response.data;
                    console.log('Data received:', response);
                    console.log('user emaillll : ', this.user);

                } else {
                    console.error('Invalid response data:', response.data);
                }
            },
            error => {
                console.error('Error fetching user:', error);
            }
        );
    }


    /**
     * Open the edit labels dialog
     */
    openEditInfosDialog(): void
    {
        this._matDialog.open(EditInfosComponent, {autoFocus: false});
    }

     /**
     * Open the edit labels dialog
     */
     openEditExperienceDialog(): void
     {
         this._matDialog.open(EditExperienceComponent, {autoFocus: false});
     }
}
