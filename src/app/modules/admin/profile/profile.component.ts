import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass } from '@angular/common';
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
    standalone     : true,
    imports        : [RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass],
    providers: [
        DatePipe
      ],
})
export class ProfileComponent{
    user: any;
    methodTriggered: EventEmitter<void> = new EventEmitter<void>();
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    UserId = this.userData.data.user.ID || '';
    CompanyId = this.userData.data.user.workCompanyId || '';

    constructor(
      private _matDialog: MatDialog,
      private userService: UserService,
      private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
      this.fetchUser();
    }

    formattedDateOfBirth(): string {
      return this.datePipe.transform(this.user.date_of_birth, 'yyyy-MM-dd') || '';
    }

    formattedDateOfHire(): string {
      return this.datePipe.transform(this.user.date_of_hire, 'yyyy-MM-dd') || '';
    }

    public fetchUser(): void {
      console.log('Fetching user...');
      this.userService.getUser(this.CompanyId, this.UserId).subscribe(
        response => {
          if (response.data && response.data.email) {
            this.user = response.data;
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

    openEditInfosDialog(user: object, UserId: string, CompanyId: string): void {
      this._matDialog.open(EditInfosComponent, {
        data: { user: this.user, UserId: this.UserId, CompanyId: this.CompanyId },
        autoFocus: false
      });
    }

    openEditExperienceDialog(): void {
      this._matDialog.open(EditExperienceComponent, { autoFocus: false });
    }
  }
