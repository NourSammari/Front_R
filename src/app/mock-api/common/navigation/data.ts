/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:home',
        link : '/dashboard'
    },
    {
        id   : 'profile',
        title: 'Profile',
        type : 'basic',
        icon : 'heroicons_outline:user-circle',
        link : '/profile'
    },
    {
        id      : 'requests',
        title   : 'Requests',
        type    : 'collapsable',
        icon    : 'heroicons_outline:queue-list',
        children: [
            {
                id   : 'requests.advance',
                title: 'Advance salary',
                type : 'basic',
                link : '/advance',
            },
            {
                id   : 'requests.loan',
                title: 'Loan request',
                type : 'basic',
                link : '/loan',
            },
            {
                id   : 'requests.leave',
                title: 'Leave request',
                type : 'basic',
                link : '/leave',
            },
            {
                id   : 'requests.exit',
                title: 'Exit permission',
                type : 'basic',
                link : '/exit',
            },
        ],
    },
    {
        id      : 'accounts',
        title   : 'Accounts',
        type    : 'collapsable',
        icon    : 'heroicons_outline:user-group',
        children: [
            {
                id   : 'accounts.users',
                title: 'Users',
                type : 'basic',
                link : '/users',
            },
            {
                id   : 'accounts.candidats',
                title: 'Candidats',
                type : 'basic',
                link : '/candidats',
            },
            {
                id   : 'accounts.interns',
                title: 'Interns',
                type : 'basic',
                link : '/interns',
            },
        ],
    },
    {
        id   : 'questions',
        title: 'Questions',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/questions'
    },
    {
        id   : 'missions',
        title: 'Missions',
        type : 'basic',
        icon : 'heroicons_outline:check-circle',
        link : '/missions'
    },
    {
        id   : 'company',
        title: 'Company',
        type : 'basic',
        icon : 'heroicons_outline:building-office-2',
        link : '/company'
    },
    {
        id   : 'role',
        title: 'Role',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/role'
    },
    {
        id   : 'project',
        title: 'Project',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/project'
    },
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
];

export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'projects',
        title: 'Projects',
        type : 'basic',
        icon : 'heroicons_outline:clipboard-document-check',
        link : '/projects'
    },
    {
        id   : 'tests',
        title: 'Tests',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/tests'
    },
    {
        id   : 'qcm',
        title: 'QCM',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qcm'
    },
];



