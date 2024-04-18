import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'app/Services/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ProfileComponent } from '../profile.component';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
    selector       : 'notes-labels',
    templateUrl    : './labels.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, FormsModule, AsyncPipe],
})
export class EditInfosComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user  : any;
    UserId : string;
    CompanyId : string;


    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        private userService : UserService ,
        private profileComponent: ProfileComponent,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.user = this.data.user;
        this.UserId = this.data.UserId;
        this.CompanyId = this.data.CompanyId;

    }

    update(companyId: string , UserId: string, updatedData: any): void {
        this.userService.updateUser(companyId , UserId, updatedData).subscribe(
          response => {
            console.log('User updated successfully:', response);
            this.profileComponent.fetchUser();
            this.dialog.closeAll();
          },
          error => {
            console.error('Error updating user:', error);
          }

        );
      }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add label
     *
     * @param title
     */
    addLabel(title: string): void
    {
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
