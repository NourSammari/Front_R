import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Mail, MailCategory } from 'app/modules/admin/loan/loanRequest/loanRequest.types';
import { Subject, takeUntil } from 'rxjs';
import { LoanRequestsService } from 'app/Services/loanRequest.service';
import { LoanRequest } from 'app/Model/loanRequest';
import { UserData } from 'app/Model/session';
import { Router , ActivatedRoute } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MailboxComponent } from '../loanRequest.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RouterLink } from '@angular/router';



@Component({
    selector     : 'mailbox-list',
    templateUrl  : './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatMenuModule , NgIf, MatButtonModule, MatIconModule, RouterLink, MatProgressBarModule, NgFor, NgClass, RouterOutlet, DatePipe],
})
export class MailboxListComponent implements OnInit, OnDestroy
{
    @ViewChild('mailList') mailList: ElementRef;

    category: MailCategory;
    mails: Mail[];
    mailsLoading: boolean = false;
    pagination: any;
    selectedMail: Mail;
    loanRequests: LoanRequest[] = [];
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    private destroy$ = new Subject<void>();


    /**
     * Constructor
     */
    constructor(
        private loanRequestsService: LoanRequestsService,
        public mailboxComponent: MailboxComponent,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.fetchLoanRequests(); // Fetch loan requests initially
        setInterval(() => {
        this.fetchLoanRequests(); // Fetch data periodically
    }, 5000);
    }

    fetchLoanRequests(): void {
        console.log('Fetching loan requests...');
        this.loanRequestsService.getAllLoanRequestsByCompany(this.CompanyId).subscribe(
            response => {
                console.log('Data received:', response.data.items);
                this.loanRequests = response.data.items;
            },
            error => {
                console.error('Error fetching loan requests:', error);
            }
        );
    }

    selectedRequest: LoanRequest | null = null;

    viewDetails(request: LoanRequest): void {
      this.selectedRequest = request;
    }

    deleteRequest(userId: string, loanRequestId: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete role',
            message: 'Are you sure you want to remove this role? This action cannot be undone!',
            actions: {
                confirm: {
                    show: true,
                    label: 'Delete',
                    color: 'warn'
                },
                cancel: {
                    show: true,
                    label: 'Cancel'
                }
            }
        });

        // Subscribe to confirmation result
        confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                if (userId && loanRequestId) {
                    this.loanRequestsService.deleteLoanRequest(userId, loanRequestId).subscribe(
                        response => {
                            console.log('Loan request deleted successfully:', response);
                            // Reset selectedRequest to null to hide the details side
                            this.selectedRequest = null;
                        },
                        error => {
                            // Handle error response
                            console.error('Error deleting loan request:', error);
                        }
                    );
                }
            }
        });
    }

    approveRequest(userId: string, loanRequestId: string): void {
        const status = {
            Status: 'approved'
        };
        // Call the updateLoanRequest method
        this.loanRequestsService.updateLoanRequest(userId, loanRequestId, status).subscribe(
            response => {
                // Handle success response
                console.log('Loan request updated successfully:', response);
            },
            error => {
                // Handle error response
                console.error('Error updating loan request:', error);
            }
        );
    }

    refuseRequest(userId: string, loanRequestId: string): void {
        const status = {
            Status: 'refused'
        };
        // Call the updateLoanRequest method
        this.loanRequestsService.updateLoanRequest(userId, loanRequestId, status).subscribe(
            response => {
                // Handle success response
                console.log('Loan request updated successfully:', response);
            },
            error => {
                // Handle error response
                console.error('Error updating loan request:', error);
            }
        );
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
