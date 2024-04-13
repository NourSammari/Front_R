import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import {InventoryVendor } from 'app/modules/admin/questions/inventory/inventory.types';
import { UpdateComponent } from 'app/modules/admin/questions/inventory/update/update.component';
import { AddComponent } from 'app/modules/admin/questions/inventory/add/add.component';
import { QuestionsService } from 'app/Services/questions.service';
import { UserData } from 'app/Model/session';
import { NotesLabelsComponent } from 'app/modules/admin/Company/inventory/labels/labels.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PageEvent } from '@angular/material/paginator';



@Component({
    selector       : 'inventory-list',
    templateUrl    : './inventory.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `,
    ],
    encapsulation  : ViewEncapsulation.None,
    animations     : fuseAnimations,
    standalone     : true,
    imports        : [NgIf, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe],
})
export class InventoryListComponent implements OnInit
{
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    totalQuestions: number;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    pageIndex: number = 0;
    pageSize: number = 10;


    flashMessage: 'success' | 'error' | null = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    vendors: InventoryVendor[];
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    questions : any[];


    /**
     * Constructor
     */
    constructor(
        private questionsService : QuestionsService,
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.fetchQuestions(); // Fetch loan requests initially
        setInterval(() => {
        this.fetchQuestions(); // Fetch data periodically
    }, 5000);
    }

    fetchQuestions(): void {
        console.log('Fetching questions...');
        this.questionsService.getQuestions(this.CompanyId , this.pageIndex + 1, this.pageSize).subscribe(
            response => {
                console.log('Data received (questions) :', response.data.items);
                this.questions = response.data.items;
                this.totalQuestions = response.data.totalCount;
            },
            error => {
                console.error('Error fetching questions:', error);
            }
        );
    }




    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.fetchQuestions();
    }


      delete(CompanyId:string,questionId: string): void {
        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete question',
            message: 'Are you sure you want to remove this question? This action cannot be undone!',
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
                        this.questionsService.deleteQuestion(this.CompanyId , questionId).subscribe(
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


    onFileSelected(event): void {
        const file: File = event.target.files[0];
        this.questionsService.UploadQuestions(this.CompanyId, file).subscribe(
        response => {
            console.log('File uploaded successfully');
        },
        error => {
            console.error('Error uploading file:', error);
        }
        );
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


     /**
     * Open the Infos dialog
     */
     openInfosDialog(): void
     {
         this._matDialog.open(NotesLabelsComponent, {autoFocus: false});
     }

      /**
     * Open the edit labels dialog
     */
     openEditLabelsDialog(question: any): void {
          this._matDialog.open(UpdateComponent, {
            data: { question: question , CompanyId: this.CompanyId },
            autoFocus: false
          });
        }




           /**
     * Open the add dialog
     */
           openAddDialog(): void
           {
               this._matDialog.open(AddComponent, {autoFocus: false});
           }


    /**
     * Close the details
     */
    closeDetails(): void
    {
    }


}
