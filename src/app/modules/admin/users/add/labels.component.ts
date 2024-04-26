import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'app/Services/user-service.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { FormBuilder,UntypedFormGroup, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserData } from 'app/Model/session';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';




@Component({
    selector       : 'notes-labels',
    templateUrl    : './labels.component.html',
    encapsulation  : ViewEncapsulation.None,
    standalone     : true,
    imports        : [ MatSnackBarModule,ReactiveFormsModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, FormsModule],
})

export class AddComponent implements OnInit
{
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    user  : any;
    composeForm: UntypedFormGroup;




    /**
     * Constructor
     */
    constructor(
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private userService : UserService,
        private snackBar: MatSnackBar,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        console.log('CompanyId:', this.CompanyId);

        this.composeForm = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            rolename: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
          }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password').value === g.get('confirmPassword').value ? null : { mismatch: true };
      }


    add(): void {
        if (this.composeForm.valid) {
          const request = {
            companyID: this.CompanyId,
            email: this.composeForm.value.email,
            firstName: this.composeForm.value.firstname,
            lastName: this.composeForm.value.lastname,
            password: this.composeForm.value.password,
            role_name: this.composeForm.value.rolename,
          };
          console.log('Request:', request);
          this.userService.createUser(this.CompanyId, request).subscribe(
            response => {
              console.log('User added successfully:', response);
              this.showSnackbar('User added successfully');
              this.dialog.closeAll();
            },
            error => {
              console.error('Error adding user:', error);
              this.showSnackbar('Error adding user. Please try again.');
            }
          );
        } else {
          console.error('Form is invalid');
        }
      }

      private showSnackbar(message: string): void {
        this.snackBar.open(message, 'Close', {
          duration: 3000,
        });
      }





    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


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
