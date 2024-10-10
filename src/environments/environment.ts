export const environment = {
    urlMain: 'http://18.191.208.46:8000/api',
    authUrl: 'http://18.191.208.46:8000/api/auth',
    recover: 'http://18.191.208.46:8000/api/user/recover-password',
    restore: 'http://18.191.208.46:8000/api/user/update-password',
    production: false,
    apiUrls: {
        getUsers: 'http://18.191.208.46:8000/api/user/getUsers', 
        getProfiles: 'http://18.191.208.46:8000/api/profile/list',
        deleteUsers: 'http://18.191.208.46:8000/api/user/delete',
        postUser: 'http://18.191.208.46:8000/api/auth/signup',
        searchUser: 'http://18.191.208.46:8000/api/user/getuserbyid',
        updateUsers: 'http://18.191.208.46:8000/api/user'
    },
    profileUrl: {
        getProfiles: 'http://18.191.208.46:8000/api/profile/list',
        createProfile: 'http://18.191.208.46:8000/api/profile/create',
        deleteProfile: 'http://18.191.208.46:8000/api/profile/delete',
        updateProfile: 'http://18.191.208.46:8000/api/profile/update',
    },
    changePassword: {
        patchChangePass: 'http://18.191.208.46:8000/api/user/change-password',
    }
};