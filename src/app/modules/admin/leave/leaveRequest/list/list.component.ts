import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LeaveRequestService } from 'app/Services/leaveRequest.service';
import { LoanRequest } from 'app/Model/loanRequest';
import { UserData } from 'app/Model/session';
import { Router , ActivatedRoute } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MailboxComponent } from '../leaveRequest.component';
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
    leaveRequest: any[] = [];
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
        private _fuseConfirmationService: FuseConfirmationService,
        private userService: UserService,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.fetchRequests();
        setInterval(() => {
        this.fetchRequests();
    }, 5000);
    }


    userMap: { [userId: string]: any } = {};

        fetchRequests(): void {
            console.log('Fetching leave requests...');
            this.leaveRequestService.getLeaveRequestsByCompany(this.CompanyId, this.pageIndex + 1, this.pageSize).subscribe(
                response => {
                    console.log('Data received:', response.data.items);
                    this.leaveRequest = response.data.items;
                    this.totalRequests = response.data.totalCount;

                    this.leaveRequest.forEach(request => {
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
        this.fetchRequests();
    }

    selectedRequest: LoanRequest | null = null;

    viewDetails(request: LoanRequest): void {
      this.selectedRequest = request;
    }

    deleteRequest(userId: string, RequestId: string): void {
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
                if (userId && RequestId) {
                    this.leaveRequestService.deleteLeaveRequest(userId, RequestId).subscribe(
                        response => {
                            console.log('Loan request deleted successfully:', response);
                            this.fetchRequests();
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

    approveRequest(userId: string, RequestId: string): void {
        const status = {
            status: 'approved'
        };
        this.leaveRequestService.updateLeaveRequest(userId, RequestId, status).subscribe(
            response => {
                console.log('Loan request updated successfully:', response);
                this.fetchRequests();
            },
            error => {
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
                console.log('Loan request updated successfully:', response);
                this.fetchRequests();
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
