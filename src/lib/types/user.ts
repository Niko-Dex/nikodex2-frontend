export enum AccountType {
    NORMAL = 0,
    ADMIN = 1,
    DUMMY = 3,
}

export type User = {
    id: number;
    username: string;
    description: string;
    account_type: AccountType;
};
