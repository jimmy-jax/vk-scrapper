export interface Schema {
    baseUrl: string;
    loginUsername: string;
    loginPassword: string;
    startUrl: string;
    maxCrawlingLevel: number;
}

export interface InputUrl {
    url: string;
    label: string;
}
