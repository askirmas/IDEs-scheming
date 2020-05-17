export declare type iTask = iTaskMeta & iVsCodeSchemaEntry & {
    files: string[][];
};
export declare type iTaskMeta = {
    source: string;
    cwd: string;
    index: number;
};
export declare type iVsCodeWorkSpace = Partial<{
    "folders": Array<{
        "path": string;
    }>;
    "settings": iVsCodeSettings;
}>;
export declare type iVsCodeSettings = Partial<{
    "json.schemas": iVsCodeSchemaEntry[];
}>;
export declare type iVsCodeSchemaEntry = {
    "fileMatch": string[];
    "url"?: string;
    "schema"?: any;
};
export declare type i$id = {
    $id: string;
};
