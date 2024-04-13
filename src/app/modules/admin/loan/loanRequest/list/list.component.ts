import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoanRequestsService } from 'app/Services/loanRequest.service';
import { LoanRequest } from 'app/Model/loanRequest';
import { UserData } from 'app/Model/session';
import { MatMenuModule } from '@angular/material/menu';
import { MailboxComponent } from '../loanRequest.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from 'app/Services/user-service.service';




@Component({
    selector     : 'mailbox-list',
    templateUrl  : './list.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatMenuModule , NgIf, MatButtonModule, MatIconModule, RouterLink, MatProgressBarModule, NgFor, NgClass, RouterOutlet, DatePipe, MatPaginatorModule],
})
export class MailboxListComponent implements OnInit, OnDestroy
{
    @ViewChild(MatPaginator) paginator: MatPaginator;


    totalRequests: number;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    pageIndex: number = 0;
    pageSize: number = 10;
    loanRequests: any[] = [];
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
        private _fuseConfirmationService: FuseConfirmationService,
        private userService: UserService,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.fetchLoanRequests();
        setInterval(() => {
            this.fetchLoanRequests();
        }, 5000);
    }

    userMap: { [userId: string]: any } = {};

        fetchLoanRequests(): void {
            console.log('Fetching leave requests...');
            this.loanRequestsService.getAllLoanRequestsByCompany(this.CompanyId, this.pageIndex + 1, this.pageSize).subscribe(
                response => {
                    console.log('Data received:', response.data.items);
                    this.loanRequests = response.data.items;
                    this.totalRequests = response.data.totalCount;

                    this.loanRequests.forEach(request => {
                        this.fetchUser(request.UserID);
                    });
                },
                error => {
                    console.error('Error fetching loan requests:', error);
                }
            );
        }

        fetchUser(UserId:string): void {
            if (!this.userMap[UserId]) {
                this.userService.getUser(this.CompanyId, UserId).subscribe(
                    response => {
                        if (response.data && response.data.email) {
                            this.userMap[UserId] = response.data;
                            console.log('Data received:', response);
                        } else {
                            console.error('Invalid response data:', response.data);
                        }
                    },
                    error => {
                        console.error('Error fetching user:', error);
                    }
                );
            }
        }

    /*fetchLoanRefusedRequests(): void {
        console.log('Fetching loan requests...');
        this.loanRequestsService.getAllLoanRequestsByCompany(this.CompanyId).subscribe(
            response => {
                console.log('Data received:', response.data.items);

                // Filter out loan requests with status 'refused'
                this.loanRequests = response.data.items.filter(item => item.status === 'refused');

                console.log('Filtered loan requests with status "refused":', this.loanRequests);
            },
            error => {
                console.error('Error fetching loan requests:', error);
            }
        );
    }

    fetchLoanApprovedRequests(): void {
        console.log('Fetching loan requests...');
        this.loanRequestsService.getAllLoanRequestsByCompany(this.CompanyId).subscribe(
            response => {
                console.log('Data received:', response.data.items);

                // Filter out loan requests with status 'refused'
                this.loanRequests = response.data.items.filter(item => item.status === 'approved');

                console.log('Filtered loan requests with status "refused":', this.loanRequests);
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

    deleteRequest(userId: string, loanRequestId: string): void {
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
       confirmation.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                if (userId && loanRequestId) {
                    this.loanRequestsService.deleteLoanRequest(userId, loanRequestId).subscribe(
                        response => {
                            console.log('Loan request deleted successfully:', response);
                            this.fetchLoanRequests();
                            this.selectedRequest = null;
                        },
                        error => {
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
        this.loanRequestsService.updateLoanRequest(userId, loanRequestId, status).subscribe(
            response => {
                console.log('Loan request updated successfully:', response);
                this.fetchLoanRequests();
            },
            error => {
                console.error('Error updating loan request:', error);
            }
        );
    }

    refuseRequest(userId: string, loanRequestId: string): void {
        const status = {
            Status: 'refused'
        };
        this.loanRequestsService.updateLoanRequest(userId, loanRequestId, status).subscribe(
            response => {
                console.log('Loan request updated successfully:', response);
                this.fetchLoanRequests();
            },
            error => {
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
