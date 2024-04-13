import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { AdvanceSalaryRequestService } from 'app/Services/advanceSalary.service';
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
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    composeForm: UntypedFormGroup;
    copyFields: { cc: boolean; bcc: boolean } = {
        cc : false,
        bcc: false,
    };
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
        private formBuilder: FormBuilder,
        private advanceSalaryRequestService: AdvanceSalaryRequestService,
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
        this.composeForm = this.formBuilder.group({
            amount: ['', [Validators.required]],
            reason: [''],
        });
    }

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
            const Amount: number = parseFloat(this.composeForm.value.amount);

            // Check if the conversion is successful
            if (!isNaN(Amount)) {

                const request = {
                    amount: Amount,
                    Reason: this.composeForm.value.reason,
                };

                this.advanceSalaryRequestService.createAdvanceSalaryRequest(this.CompanyId, request).subscribe(
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
