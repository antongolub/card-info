// @flow

export type IAny = any

export type IPaymentSystemDefinition = {
  key: string;
  name: string;
  prefixPattern: RegExp;
  panPattern: RegExp;
  lengths: number[];
  codeName: string;
  codeLength: number;
  algorithm?: string;
}
export type IPaymentSystemDefinitions = IPaymentSystemDefinition[]

export type IBinDefinition = {
}

export type ICardInfo = Object
export type IPaymentSystem = string

export type IServiceKeys = 'getPaymentSystem' | 'getCardInfo'
export type IServiceOpts = {
  url? :string;
  headers?: IAny;
  skipError?: boolean;
}
export interface IService {
  opts: IServiceOpts;
  constructor(IServiceOpts): IService;
  getPaymentSystem(pan: string): Promise<?IPaymentSystem>;
  getCardInfo(pan: string): Promise<?ICardInfo>;
  [key: IServiceKeys]: (pan: string) => Promise<?ICardInfo | ?IPaymentSystem>;
}

export interface IResponse {
  json(): IAny
}

export type IHttpOpts = {
  url: string;
} & RequestOptions;
export type IHttpTransport = {
  (opts: IHttpOpts): Promise<IAny>
}

export type IApiOpts = {
  type?: string;
  transport?: IHttpTransport;
}
export interface IApi extends IService {
  constructor(opts: IApiOpts): IApi;
  service: IService;
}
