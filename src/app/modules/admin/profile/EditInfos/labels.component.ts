import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
    selector: 'notes-labels',
    templateUrl: './labels.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatAutocompleteModule,MatOptionModule,MatDatepickerModule,MatNativeDateModule,MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, FormsModule, AsyncPipe],
    providers: [
        DatePipe
      ],
})
export class EditInfosComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: any;
    UserId: string;
    CompanyId: string;
    genderControl = new FormControl();
    genderOptions: string[] = ['Female', 'Male'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialog,
        private userService: UserService,
        private profileComponent: ProfileComponent,
        private datePipe: DatePipe,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {}

    ngOnInit(): void {
        this.user = this.data.user;
        this.UserId = this.data.UserId;
        this.CompanyId = this.data.CompanyId;

    }



    update(companyId: string, userId: string, updatedData: any): void {
        // Format date_of_birth using DatePipe
        updatedData.date_of_birth = this.datePipe.transform(updatedData.date_of_birth, 'yyyy-MM-dd');

        this.userService.updateUser(companyId, userId, updatedData).subscribe(
            (response) => {
                console.log('User updated successfully:', response);
                this.profileComponent.fetchUser();
                this.dialog.closeAll();
            },
            (error) => {
                console.error('Error updating user:', error);
            }
        );
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addLabel(title: string): void {}

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
