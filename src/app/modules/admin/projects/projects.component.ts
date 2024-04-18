import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseCardComponent } from '@fuse/components/card';
import { MatSelectModule } from '@angular/material/select';
import { ProjectsService } from 'app/Services/project.service';
import { TestsService } from 'app/Services/test.service';
import { UserData } from 'app/Model/session';
import { NgFor} from '@angular/common';
import { CodeProject } from 'app/Model/project';



@Component({
    selector       : 'settings-account',
    templateUrl    : './projects.component.html',
    encapsulation  : ViewEncapsulation.None,
    standalone     : true,
    imports        : [ MatSelectModule,MatOptionModule,FormsModule, FuseCardComponent ,ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule,NgFor],
})
export class ProjectsComponent implements OnInit
{
    userDataString = localStorage.getItem('userData');
    userData: UserData = JSON.parse(this.userDataString);
    CompanyId = this.userData.data.user.workCompanyId || '';
    UserId = this.userData.data.user.ID || '';
    projects : any[];
    request : CodeProject;
    selectedProject : string;

    /**
     * Constructor
     */
    constructor(
        private projectsService : ProjectsService,
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
        this.fetchProjects();
    }

    fetchProjects(): void {
        console.log('Fetching projects...');
        this.projectsService.getProjects(this.CompanyId).subscribe(
            response => {
                console.log('Data received  :', response.data.items);
                this.projects = response.data.items;
            },
            error => {
                console.error('Error fetching projects:', error);
            }
        );
    }

    AssignProject(): void{
        console.log('Selected project code:', this.selectedProject);

        console.log ('Project assigned...');
        const request = {
            code: this.selectedProject,
        };

        this.projectsService.assignProjectToCandidate(this.CompanyId,"c31620f4-27d3-47af-9f84-b8eb311e3194",request).subscribe(
            response => {
                console.log('Project assigned successfully:', response);
            },
            error => {
                console.error('Error affecting project:', error);
            }
        );
    }

    GenerateTest(): void{
        console.log('generating test ...');
        this.testService.createTest(this.CompanyId,"c31620f4-27d3-47af-9f84-b8eb311e3194").subscribe(
            response => {
                console.log('Test generated succefully',response);
            },
            error => {
                console.error('Test failed ...', error);
            }
        );
    }
}
