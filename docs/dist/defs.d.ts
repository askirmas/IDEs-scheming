export { iValidator, iScope, iVsCodeWorkSpace, iVsCodeSettings, iErrorText, iIdeaSettings };
declare type iVsCodeSettings = {
    'json.schemas': {
        fileMatch: string[];
        url: string;
    }[];
};
declare type iVsCodeWorkSpace = {
    "settings": iVsCodeSettings;
};
declare type iValidator_ = (o: object) => boolean;
interface iValidator extends iValidator_ {
    errors: any;
}
declare type iErrorText = (errors: any) => string;
declare type iScope = {
    fileList: Set<string>;
    [k: string]: any;
};
declare type iIdeaSettings = {
    project: {
        component: Array<{
            state: Array<{
                map: Array<{
                    entry: Array<{
                        value: Array<{
                            SchemaInfo: Array<{
                                option: Array<iIdeaLeaf & {
                                    list?: Array<{
                                        Item: Array<{
                                            option: iIdeaLeaf[];
                                        }>;
                                    }>;
                                }>;
                            }>;
                        }>;
                    }>;
                }>;
            }>;
        }>;
    };
};
declare type iIdeaLeaf = {
    $: {
        name: string;
        value?: string;
    };
};
