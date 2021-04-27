export interface IAttachment {
    uuid: string;
    type: number;
    url: string;
    height: number;
    width: number;
}

export interface OverrideAttachment {
    uuid?: string;
    type?: number;
    url?: string;
    height?: number;
    width?: number;
}