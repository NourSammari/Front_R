import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { MailboxComposeComponent } from 'app/modules/admin/loan/loanRequest/compose/compose.component';
import { labelColorDefs } from 'app/modules/admin/loan/loanRequest/loanRequest.constants';
import { MailboxService } from 'app/modules/admin/loan/loanRequest/loanRequest.service';
import { MailFilter, MailFolder, MailLabel } from 'app/modules/admin/loan/loanRequest/loanRequest.types';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector     : 'mailbox-sidebar',
    templateUrl  : './sidebar.component.html',
    styleUrls    : ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, MatIconModule, FuseVerticalNavigationComponent],
})
export class MailboxSidebarComponent implements OnInit, OnDestroy
{
    filters: MailFilter[];
    folders: MailFolder[] = [];
    labels: MailLabel[];
    menuData: FuseNavigationItem[] = [];
    private _filtersMenuData: FuseNavigationItem[] = [];
    private _foldersMenuData: FuseNavigationItem[] = [];
    private _labelsMenuData: FuseNavigationItem[] = [];
    private _otherMenuData: FuseNavigationItem[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    constructor(
        private _mailboxService: MailboxService,
        private _matDialog: MatDialog,
        private _fuseNavigationService: FuseNavigationService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._generateFoldersMenuLinks();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    openComposeDialog(): void {
        const dialogRef = this._matDialog.open(MailboxComposeComponent);
        dialogRef.afterClosed().subscribe((result) => {
            console.log('Compose dialog was closed!');
        });
    }

    private _generateFoldersMenuLinks(): void {
        this._foldersMenuData = [];

        // Add "Loan Request" item
        const loanRequestItem: FuseNavigationItem = {
            id   : 'loan-request',
            title: 'Loan Request',
            type : 'basic',
            icon : 'icon-for-loan-request',

        };
        this._foldersMenuData.push(loanRequestItem);

        // Iterate through the rest of the folders
        this.folders.forEach((folder) => {
            // Generate menu item for the folder
            const menuItem: FuseNavigationItem = {
                id   : folder.id,
                title: folder.title,
                type : 'basic',
                icon : folder.icon,
                // No need to specify an action here
            };

            if (folder.count && folder.count > 0) {
                menuItem['badge'] = {
                    title: folder.count + '',
                };
            }

            this._foldersMenuData.push(menuItem);
        });

        this._updateMenuData();
    }

    private _updateMenuData(): void {
        this.menuData = [
            {
                title   : 'Loan Request',
                type    : 'group',
                children: this._foldersMenuData.map(folder => ({
                    ...folder,
                })),
                link: ''
            },
            {
                title   : 'FILTERS',
                type    : 'group',
                children: [
                    {
                        id   : 'accepted',
                        title: 'Accepted',
                        type : 'basic',
                        icon : 'heroicons_outline:star',
                        link : 'accepted'
                    },
                    {
                        id   : 'refused',
                        title: 'Refused',
                        type : 'basic',
                        icon : 'heroicons_outline:star',
                        link : 'refused',
                    },
                ],
            },
        ];
    }


    
}
