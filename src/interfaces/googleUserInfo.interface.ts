export default interface IGoogleUserInfo {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: StreamPipeOptions;
    email_verified: boolean;
    locale: string;
    hd: string;
}
