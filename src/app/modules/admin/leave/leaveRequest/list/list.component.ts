import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Mail, MailCategory } from 'app/modules/admin/loan/loanRequest/loanRequest.types';
import { Subject, takeUntil } from 'rxjs';
import { LeaveRequestService } from 'app/Services/leaveRequest.service';
import { LoanRequest } from 'app/Model/loanRequest';
import { UserData } from 'app/Model/session';
import { Router , ActivatedRoute } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MailboxComponent } from '../leaveRequest.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { LeaveRequestDetails } from 'app/Model/leaveRequest';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';


@Component({
    selector     : 'mailbox-list',
    templateUrl  : './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatMenuModule , NgIf, MatButtonModule, MatIconModule, RouterLink, MatProgressBarModule, NgFor, NgClass, RouterOutlet, DatePipe, MatPaginatorModule],
})
export class MailboxListComponent implements OnInit, OnDestroy
{
    @ViewChild('mailList') mailList: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    totalRequests: number;
    pageSizeOptions: number[] = [5, 10, 25, 50];
    pageIndex: number = 0;
    pageSize: number = 10;

    category: MailCategory;
    mails: Mail[];
    mailsLoading: boolean = false;
    pagination: any;
    selectedMail: Mail;
    leaveRequest: LeaveRequestDetails[] = [];
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    private destroy$ = new Subject<void>();


    /**
     * Constructor
     */
    constructor(
        private leaveRequestService: LeaveRequestService,
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
        this.leaveRequestService.getLeaveRequestsByCompany(this.CompanyId, this.pageIndex + 1, this.pageSize).subscribe(
            response => {
                console.log('Data received:', response.data.items);
                this.leaveRequest = response.data.items;
                this.totalRequests = response.data.totalCount;
            },
            error => {
                console.error('Error fetching loan requests:', error);
            }
        );
    }

    /*fetchLoanRefusedRequests(): void {
        console.log('Fetching loan requests...');
        this.leaveRequestService.getLeaveRequestsByCompany(this.CompanyId).subscribe(
            response => {
                console.log('Data received:', response.data.items);

                // Filter out loan requests with status 'refused'
                this.leaveRequest = response.data.items.filter(item => item.status === 'refused');

                console.log('Filtered loan requests with status "refused":', this.leaveRequest);
            },
            error => {
                console.error('Error fetching loan requests:', error);
            }
        );
    }

    fetchLoanApprovedRequests(): void {
        console.log('Fetching loan requests...');
        this.leaveRequestService.getLeaveRequestsByCompany(this.CompanyId).subscribe(
            response => {
                console.log('Data received:', response.data.items);

                // Filter out loan requests with status 'refused'
                this.leaveRequest = response.data.items.filter(item => item.status === 'approved');

                console.log('Filtered loan requests with status "refused":', this.leaveRequest);
            },
            error => {
                console.error('Error fetching loan requests:', error);
            }
        );
    }*/

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchLoanRequests();
    }

    selectedRequest: LoanRequest | null = null;

    viewDetails(request: LoanRequest): void {
      this.selectedRequest = request;
    }

    deleteRequest(userId: string, RequestId: string): void {
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
                if (userId && RequestId) {
                    this.leaveRequestService.deleteLeaveRequest(userId, RequestId).subscribe(
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

    approveRequest(userId: string, RequestId: string): void {
        const status = {
            status: 'approved'
        };
        this.leaveRequestService.updateLeaveRequest(userId, RequestId, status).subscribe(
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

    refuseRequest(userId: string, RequestId: string): void {
        const status = {
            status: 'refused'
        };
        this.leaveRequestService.updateLeaveRequest(userId, RequestId , status).subscribe(
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
