import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ContactsService } from 'app/modules/admin/users/contacts.service';
import { Contact, Country, Tag } from 'app/modules/admin/users/contacts.types';
import { ContactsListComponent } from 'app/modules/admin/users/list/list.component';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { UserService } from 'app/Services/user-service.service';
import { UserData } from 'app/Model/session';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';



@Component({
    selector       : 'contacts-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    standalone     : true,
    imports        : [NgIf, MatButtonModule, MatTooltipModule, RouterLink, MatIconModule, NgFor, FormsModule, ReactiveFormsModule, MatRippleModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, NgClass, MatSelectModule, MatOptionModule, MatDatepickerModule, TextFieldModule, FuseFindByKeyPipe, DatePipe],
})
export class ContactsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    @Inject(DOCUMENT) private document: Document;
    private _elementRef: ElementRef;


    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    UserId = this.userData.data.user.ID || '';
    CompanyId = this.userData.data.user.workCompanyId || '';

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    contact: Contact;
    contactForm: UntypedFormGroup;
    contacts: Contact[];
    countries: Country[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    id :  string;
    user : any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ContactsListComponent,
        private _contactsService: ContactsService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
    )
    {
    }


    closeDrawer() {

        this.matDrawer.close();

      }

    ngOnDestroy(): void {
       this._unsubscribeAll.next(null);
       this._unsubscribeAll.complete();
       if (this._tagsPanelOverlayRef) {
           this._tagsPanelOverlayRef.dispose();
       }
       if (this._elementRef) {
           this.document.removeEventListener('click', this.onDocumentClick.bind(this));
       }
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._contactsListComponent.matDrawer.open();

        // Subscribe to route parameter changes
        this.route.paramMap.subscribe(params => {
            // Get the user ID from the route parameters
            const userId = params.get('id');
            console.log("User Id : ", userId); // Log the userId obtained from the route

            // Fetch user data using the obtained userId
            if (userId) {
                this.fetchUser(userId);
            }
        });

        this.document.addEventListener('click', this.onDocumentClick.bind(this));
    }


    fetchUser(userId: string): void {
        console.log('Fetching user...');
        this.userService.getUser(this.CompanyId, userId).subscribe(
            response => {
                if (response.data && response.data.email) {
                    this.user = response.data;
                    console.log('Data received:', response);
                    console.log('User email:', this.user.email);
                } else {
                    console.error('Invalid response data:', response.data);
                }
            },
            error => {
                console.error('Error fetching user:', error);
            }
        );
    }

    onDocumentClick(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
        // Close the drawer
        this.closeDrawer();
    }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the contact
     */
    updateContact(): void
    {
        // Get the contact object
        const contact = this.contactForm.getRawValue();

        // Go through the contact object and clear empty values
        contact.emails = contact.emails.filter(email => email.email);

        contact.phoneNumbers = contact.phoneNumbers.filter(phoneNumber => phoneNumber.phoneNumber);

        // Update the contact on the server
        this._contactsService.updateContact(contact.id, contact).subscribe(() =>
        {
            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }

    deleteUser(userId : string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete question',
            message: 'Are you sure you want to remove this user? This action cannot be undone!',
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
                this.userService.deleteUser( this.CompanyId, userId).subscribe(
                    () => {
                        console.log('User deleted successfully');
                    },
                    error => {
                        console.error('Error deleting item:', error);
                    }
                );
            }
        });
    }






    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
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

    navigateToUsers(): void {
        this.router.navigate(['users']);
    }
}
