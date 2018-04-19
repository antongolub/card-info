// @flow

import type {
  IAny,
  ICardInfo,
  IPaymentSystem,
  IService,
  IServiceKeys,
  IServiceOpts,
  IServiceResponse
} from '../interface'

import assets from '../assets'

export class AbstractService {
  opts: IServiceOpts
  $key: IServiceKeys
  $value: any

  constructor (opts: IServiceOpts) {
    if (this.constructor === AbstractService) {
      throw new Error('abstract cannot be instantiated')
    }

    this.opts = this.constructor.resolveOpts(opts)
    return this
  }

  getCardInfo (pan: string): Promise<?ICardInfo> {
    return this.constructor.promiseNull()
  }

  getPaymentSystem (pan: string): Promise<?IPaymentSystem> {
    return this.constructor.promiseNull()
  }

  static resolveOpts (raw: IAny): IServiceOpts {
    return Object.assign({}, this.DEFAULT_OPTS, raw)
  }

  static normalizePaymentSystem (value: string): string | null {
    return typeof value === 'string'
      ? value.toUpperCase()
      : null
  }

  static performRequest (pan: string, opts: IServiceOpts, formatter: (res: IAny) => ?ICardInfo | ?IPaymentSystem): Promise<IAny> {
    const url = `${opts.url || ''}/${pan}`
    const {transport, headers, skipError} = opts

    return assets.transport({
      ...transport,
      url,
      headers
    })
      .then(this.parseResponse)
      .then(formatter)
      .catch((err: IAny) => {
        if (!skipError) {
          throw err
        }

        return null
      })
  }

  static parseResponse (res: IServiceResponse): IAny {
    return res && typeof res.json === 'function'
      ? res.json()
      : res
  }

  static promiseNull (): Promise<null> {
    return new assets.Promise(resolve => resolve(null))
  }

  static DEFAULT_OPTS: Object = {}
}

export class AbstractRemoteService extends AbstractService implements IService {
  opts: IServiceOpts
  $key: IServiceKeys
  $value: any

  getPaymentSystem (pan: string): Promise<?IPaymentSystem> {
    return AbstractService.performRequest(pan, this.opts, this.constructor.formatPaymentSystem.bind(this.constructor))
  }

  getCardInfo (pan: string): Promise<?ICardInfo> {
    return AbstractService.performRequest(pan, this.opts, this.constructor.formatCardInfo.bind(this.constructor))
  }

  static formatPaymentSystem (res: IAny) {
    return res
  }

  static formatCardInfo (res: IAny) {
    return res
  }
}

export default AbstractService
