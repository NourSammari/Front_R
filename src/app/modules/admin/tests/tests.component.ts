import { CommonModule } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { TestsService } from 'app/Services/test.service';
import { UserData } from 'app/Model/session';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'scrumboard-boards',
    templateUrl: './tests.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule, CdkScrollable, NgFor, RouterLink, MatIconModule, NgIf, MatTooltipModule, MatProgressBarModule],
})
export class TestsComponent implements OnInit, OnDestroy {

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    tests: any[] = [];

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private testsService: TestsService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.fetchTests();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------



    fetchTests(): void {
        console.log('Fetching tests...');
        this.testsService.ReadTestsList(this.CompanyId, "c31620f4-27d3-47af-9f84-b8eb311e3194").subscribe(
            response => {
                console.log('Data received  :', response.data);
                this.tests = response.data;
            },
            error => {
                console.error('Error fetching tests:', error);
            }
        );
    }

    



    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
