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
import { UserData } from 'app/Model/session';
import { EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


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
    methodTriggered: EventEmitter<void> = new EventEmitter<void>();
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

    public fetchUser(): void {
        console.log('Fetching user...');
        this.userService.getUser(this.CompanyId, this.UserId).subscribe(
            response => {
                if (response.data && response.data.email) {
                    this.user = response.data;
                    console.log('Data After :', this.userData);
                    const name = response.data.firstname +""+response.data.lastname;
                    localStorage.setItem('userData.data.user.email', response.data.email);
                    localStorage.setItem('userData.data.user.name', name);
                    console.log('Data Before :', this.userData);
                    console.log('Data received:', response);
                } else {
                    console.error('Invalid response data:', response.data);
                }
            },
            error => {
                console.error('Error fetching user:', error);
            }
        );
        this.methodTriggered.emit();
    }


    /**
     * Open the edit labels dialog
     */
    openEditInfosDialog( user:object , UserId : string, CompanyId : string): void
    {
        this._matDialog.open(EditInfosComponent,  {
            data: { user: this.user , UserId: this.UserId , CompanyId: this.CompanyId },
            autoFocus: false
          });
    }

     /**
     * Open the edit labels dialog
     */
     openEditExperienceDialog(): void
     {
         this._matDialog.open(EditExperienceComponent, {autoFocus: false});
     }
}
