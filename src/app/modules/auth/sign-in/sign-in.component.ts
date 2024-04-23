import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {  Router, RouterLink , NavigationExtras } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FormGroup, FormBuilder} from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import { SignIn } from 'app/Model/signin';
import { SigninService } from 'app/Services/signinService.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class AuthSignInComponent implements OnInit {

responseDataArray: any[] = [];
sign :SignIn ;

    signInForm: FormGroup;
    showAlert: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private SigninService:SigninService,
    ) {}

    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });
    }

    signIn(): void {
        console.log('Email field valid:', this.signInForm.get('email').valid);
        console.log('Password field valid:', this.signInForm.get('password').valid);
        if (this.signInForm.invalid) {
            console.error('Invalid form');
            return;
        }
        this.SigninService.SignInUser(this.signInForm.value).subscribe(
            response => {
                this.responseDataArray.push(response);
                localStorage.setItem('userData', JSON.stringify(this.responseDataArray[0]));
                const userType = 'user';
                localStorage.setItem('userType', userType);
                const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect-user';
                this._router.navigateByUrl(redirectURL);
            },
            error => {
                console.error('Error during sign in:', error);
            }
        );
    }
}

