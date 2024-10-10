export interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    phone: string;
    profileId: number;
    username: string;
    surname: string;
    status: boolean;
    resource: string[];
}
export interface UserUpdate {
    email: string;
    name: string;
    surname: string;
    age: number;
    phone: string;
    username: string; 
}


export interface UserData {
    message: string;
    data: {
      content: User[];
    };
}

