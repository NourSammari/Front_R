import { DatePipe, NgIf } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuillEditorComponent } from 'ngx-quill';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExitPermissionService } from 'app/Services/exitPermission.service';
import { UserData } from 'app/Model/session';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';


@Component({
    selector: 'mailbox-compose',
    templateUrl: './compose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatNativeDateModule,MatDatepickerModule,MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
    providers: [
        DatePipe
      ],
})
export class MailboxComposeComponent implements OnInit {
    userDataString = localStorage.getItem('userData');
    userData: UserData;
    CompanyId: string;
    composeForm: UntypedFormGroup;

    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }],
            ['clean'],
        ],
    };

    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private formBuilder: FormBuilder,
        private exitPermissionService: ExitPermissionService,
        private datePipe: DatePipe,
    ) {}

    ngOnInit(): void {
        this.userData = JSON.parse(this.userDataString);
        this.CompanyId = this.userData?.data?.user?.workCompanyId || '';

        this.composeForm = this.formBuilder.group({
            reason: ['', Validators.required],
            start_time: [''],
            return_time: [''],
            type: [''],
        });
    }

    saveAndClose(): void {
        this.saveAsDraft();
        this.matDialogRef.close();
    }

    discard(): void {
    }

    saveAsDraft(): void {
    }

    send(): void {
        if (this.composeForm.valid) {
            this.composeForm.value.start_time = this.datePipe.transform(this.composeForm.value.start_time, 'yyyy-MM-dd');
            this.composeForm.value.return_time = this.datePipe.transform(this.composeForm.value.return_time, 'yyyy-MM-dd');
            console.log("start time : ",this.composeForm.value.start_time);
            console.log("return time : ",this.composeForm.value.return_time);
            const request = {
                reason: this.composeForm.value.reason,
                start_date: this.composeForm.value.start_time,
                return_date: this.composeForm.value.return_time,
                type: this.composeForm.value.type,
            };

            this.exitPermissionService.addExitPermission(this.CompanyId, request).subscribe(
                response => {
                    console.log('Exit permission added successfully:', response);

                    this.matDialogRef.close();
                },
                error => {
                    console.error('Error adding exit permission:', error);
                }
            );
        } else {
            console.error('Form is invalid');
        }
    }
}
