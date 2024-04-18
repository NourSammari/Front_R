import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TestsService } from 'app/Services/test.service';
import { UserData } from 'app/Model/session';
import { CandidatAnswerIn } from 'app/Model/test';
import { NgFor } from '@angular/common';




@Component({
    selector     : 'help-center',
    templateUrl  : './qcm.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatFormFieldModule, MatInputModule, MatIconModule, RouterLink, MatExpansionModule, NgFor],
})
export class QcmComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject();
    id: string;
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    questions : any[];
    currentQuestionIndex: number = 0;
    request : CandidatAnswerIn;

    /**
     * Constructor
     */
    constructor(private route: ActivatedRoute,
                private testService : TestsService,
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
         // Subscribe to route parameters
        this.route.params.subscribe(params => {
        // Retrieve the id parameter
        this.id = params['id'];
        console.log('ID:', this.id);
    });
    this.fetchQuestions();

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


    fetchQuestions(): void {
        console.log('Fetching projects...');
        this.testService.ReadQuestionsbyTest(this.CompanyId,this.id).subscribe(
            response => {
                console.log('Data received  :', response.data.items);
                this.questions = response.data.items;
            },
            error => {
                console.error('Error fetching projects:', error);
            }
        );
    }

    updateQuestionAnswer(questionId : string, answer : string ): void{
        console.log('updating Answer...');
        const request = {
            candidatAnswer: answer,
        };
        this.testService.UpdateCandidatAnswer(this.CompanyId,"c31620f4-27d3-47af-9f84-b8eb311e3194",this.id,questionId ,request).subscribe(
            response => {
                console.log('Answer Updated Succefully',response.data);
            },
            error => {
                console.error('Error updating answer',error);
            }
        );
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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

    /**
     * Move to the previous question
     */
    moveToPreviousQuestion(): void {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    /**
     * Move to the next question
     */
    moveToNextQuestion(): void {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
        }
    }
}
