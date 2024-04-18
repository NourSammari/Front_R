import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
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
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ContactsListComponent,
        private _contactsService: ContactsService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private activatedRoute: ActivatedRoute,
        private userService: UserService,


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

            this.activatedRoute.paramMap.subscribe(params => {
                this.id = params.get('id');
                this.fetchUser();
            });

    }

    fetchUser(): void {
        console.log('Fetching user...');
        this.userService.getUser(this.CompanyId, this.id).subscribe(
            response => {
                if (response.data && response.data.email) {
                    this.user = response.data;
                    console.log('Data received:', response);
                    console.log('user email:', this.user.email);
                } else {
                    console.error('Invalid response data:', response.data);
                }
            },
            error => {
                console.error('Error fetching user:', error);
            }
        );
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._contactsListComponent.matDrawer.close();
    }

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

    /**
     * Delete the contact
     */
    deleteUser(companyID:string, id:string): void
    {
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
                        this.userService.deleteUser(this.CompanyId, this.id).subscribe(
                          () => {
                            console.log('Item deleted successfully');
                          },
                          error => {
                            console.error('Error deleting item:', error);
                          }
                        );
                      }
            }
        );

    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        this._contactsService.uploadAvatar(this.contact.id, file).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.contactForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the contact
        this.contact.avatar = null;
    }

    /**
     * Open tags panel
     */
    openTagsPanel(): void
    {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._tagsPanelOverlayRef.attachments().subscribe(() =>
        {
            // Add a class to the origin
            this._renderer2.addClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() =>
        {
            // Remove the class from the origin
            this._renderer2.removeClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

            // If overlay exists and attached...
            if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.tags;

                // Toggle the edit mode off
                this.tagsEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
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
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.contact.tags.find(id => id === tag.id);

        // If the found tag is already applied to the contact...
        if ( isTagApplied )
        {
            // Remove the tag from the contact
            this.removeTagFromContact(tag);
        }
        else
        {
            // Otherwise add the tag to the contact
            this.addTagToContact(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title,
        };

        // Create tag on the server
        this._contactsService.createTag(tag)
            .subscribe((response) =>
            {
                // Add the tag to the contact
                this.addTagToContact(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Tag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._contactsService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Tag): void
    {
        // Delete the tag from the server
        this._contactsService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the contact
     *
     * @param tag
     */
    addTagToContact(tag: Tag): void
    {
        // Add the tag
        this.contact.tags.unshift(tag.id);

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the contact
     *
     * @param tag
     */
    removeTagFromContact(tag: Tag): void
    {
        // Remove the tag
        this.contact.tags.splice(this.contact.tags.findIndex(item => item === tag.id), 1);

        // Update the contact form
        this.contactForm.get('tags').patchValue(this.contact.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle contact tag
     *
     * @param tag
     */
    toggleContactTag(tag: Tag): void
    {
        if ( this.contact.tags.includes(tag.id) )
        {
            this.removeTagFromContact(tag);
        }
        else
        {
            this.addTagToContact(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Add the email field
     */
    addEmailField(): void
    {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: [''],
        });

        // Add the email form group to the emails form array
        (this.contactForm.get('emails') as UntypedFormArray).push(emailFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeEmailField(index: number): void
    {
        // Get form array for emails
        const emailsFormArray = this.contactForm.get('emails') as UntypedFormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void
    {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country    : ['us'],
            phoneNumber: [''],
            label      : [''],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.contactForm.get('phoneNumbers') as UntypedFormArray).push(phoneNumberFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void
    {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.contactForm.get('phoneNumbers') as UntypedFormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country
    {
        return this.countries.find(country => country.iso === iso);
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
}
