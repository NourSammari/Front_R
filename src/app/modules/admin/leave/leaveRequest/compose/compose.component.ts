import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { LeaveRequestService } from 'app/Services/leaveRequest.service';
import { UserData } from 'app/Model/session';


@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './compose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
})
export class MailboxComposeComponent implements OnInit
{
    composeForm: FormGroup;
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean'],
        ],
    };

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: UntypedFormBuilder,
        private leaveRequestService: LeaveRequestService,

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


     {
            this.composeForm = this._formBuilder.group({
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            type: [''],
            reason: ['']
            });
  }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
/**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {
    }




    send(): void {
        if (this.composeForm.valid) {

            if (this.composeForm.valid) {
                const request = {
                    start_date: this.composeForm.value.start_date,
                    end_date: this.composeForm.value.end_date,
                    leave_type: this.composeForm.value.type,
                    reason: this.composeForm.value.reason
                };
            const Amount: number = parseFloat(this.composeForm.value.amount);

            

                this.leaveRequestService.createLeaveRequest(this.CompanyId, request).subscribe(
                    response => {
                        // Handle success response
                        console.log('Loan request added successfully:', response);
                        this.matDialogRef.close();
                    },
                    error => {
                        // Handle error response
                        console.error('Error adding loan request:', error);
                    }
                );
            } else {
                console.error('LoanAmount is not a valid number');
            }
        }
    }
}
