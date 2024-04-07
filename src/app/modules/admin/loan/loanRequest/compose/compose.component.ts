import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Correct import for FormBuilder and FormGroup
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import { LoanRequestsService } from 'app/Services/loanRequest.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserData } from 'app/Model/session';


@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './compose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,FormsModule, ReactiveFormsModule],
})
export class MailboxComposeComponent implements OnInit {
    composeForm: FormGroup;
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';

    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private formBuilder: FormBuilder, // Use FormBuilder directly
        private loanRequestService: LoanRequestsService // Use the loan requests service directly
    ) {}

    ngOnInit(): void {
        // Create the form
        this.composeForm = this.formBuilder.group({
            Loan_amount: ['', [Validators.required]],
            Loan_duration: [''],
            interest_rate: [''],
            reason: [''],
            path_document: ['']
        });
    }
        saveAndClose(): void {
            this.saveAsDraft();
            this.matDialogRef.close();
        }

        discard(): void {
            // Implement discard logic here if needed
        }

        saveAsDraft(): void {
            // Implement saveAsDraft logic here if needed
        }

        send(): void {
            if (this.composeForm.valid) {
                // Convert LoanAmount to a number
                const loanAmount: number = parseFloat(this.composeForm.value.Loan_amount);
                const interestRate: number = parseFloat(this.composeForm.value.interest_rate);


                // Check if the conversion is successful
                if (!isNaN(loanAmount)) {
                    const request = {
                        LoanAmount: loanAmount, // Assign the converted value
                        LoanDuration: this.composeForm.value.Loan_duration,
                        InterestRate: interestRate,
                        ReasonForLoan: this.composeForm.value.reason,
                        PathDocument: this.composeForm.value.path_document
                    };

                    this.loanRequestService.addLoanRequest(this.CompanyId, request).subscribe(
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
