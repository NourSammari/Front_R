import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, filter, Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector       : 'notes-labels',
    templateUrl    : './labels.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, FormsModule, AsyncPipe],
})
export class EditExperienceComponent implements OnInit, OnDestroy
{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    experiences: string[] = [];


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
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

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Add label
     *
     * @param title
     */
    addLabel(title: string): void
    {
    }

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

    splitText(value: string): void {
        // Split the entered text by comma and trim each part
        const parts = value.split(',').map(part => part.trim());

        // Remove empty parts and add non-empty parts to the experiences array
        this.experiences = parts.filter(part => part !== '');
    }
}
