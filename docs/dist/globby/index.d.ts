import globby from 'globby';
declare type GlobbyOptions = Parameters<typeof globby>[1];
export { g as globby };
declare function g(patterns: Parameters<typeof globby>[0], opts?: GlobbyOptions): Promise<string[]>;
