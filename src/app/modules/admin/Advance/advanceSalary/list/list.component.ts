import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Mail, MailCategory } from 'app/modules/admin/loan/loanRequest/loanRequest.types';
import { Subject, takeUntil } from 'rxjs';
import { AdvanceSalaryRequestService } from 'app/Services/advanceSalary.service';
import { UserData } from 'app/Model/session';
import { Router , ActivatedRoute } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MailboxComponent } from '../advanceSalary.component';
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
    user : any;
    private destroy$ = new Subject<void>();




    /**
     * Constructor
     */
    constructor(
        private advanceSalaryRequestService: AdvanceSalaryRequestService,
        private userService: UserService,
        public mailboxComponent: MailboxComponent,
        private _fuseConfirmationService: FuseConfirmationService,
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
    console.log('Fetching loan requests...');
    this.advanceSalaryRequestService.getAdvanceSalaryRequestsByCompany(this.CompanyId, this.pageIndex + 1, this.pageSize).subscribe(
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

fetchUser(userId:string): void {
    if (!this.userMap[userId]) {
        this.userService.getUser(this.CompanyId, userId).subscribe(
            response => {
                if (response.data && response.data.email) {
                    this.userMap[userId] = response.data;
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

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchLoanRequests();
    }

    /*fetchLoanRefusedRequests(): void {
        console.log('Fetching loan requests...');
        this.advanceSalaryRequestService.getAdvanceSalaryRequestsByCompany(this.CompanyId).subscribe(
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
        this.advanceSalaryRequestService.getAdvanceSalaryRequestsByCompany(this.CompanyId).subscribe(
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


    /*fetchLoanRefusedRequests(): void {
        console.log('Fetching loan requests...');
        this.advanceSalaryRequestService.getAdvanceSalaryRequestsByCompany(this.CompanyId).subscribe(
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
        this.advanceSalaryRequestService.getAdvanceSalaryRequestsByCompany(this.CompanyId).subscribe(
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



    selectedRequest:   any | null = null;

    viewDetails(request: any): void {
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
                    this.advanceSalaryRequestService.deleteAdvanceSalaryRequest(userId, RequestId).subscribe(
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

    approveRequest(userId: string, RequestId: string): void {
        const status = {
            status: 'approved'
        };
        this.advanceSalaryRequestService.updateAdvanceSalaryRequest(userId, RequestId, status).subscribe(
            response => {
                console.log('Loan request updated successfully:', response);
                this.fetchLoanRequests();
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
        this.advanceSalaryRequestService.updateAdvanceSalaryRequest(userId, RequestId , status).subscribe(
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
