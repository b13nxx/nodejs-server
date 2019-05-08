import { NextFunction, Request, Response, Router } from 'express'
import { Pool } from 'mysql'
import HttpStatus from '../definition/HttpStatus'
import ServiceResponse from '../definition/ServiceResponse'

export default class BaseService {
  private router: Router
  public connectionPool

  constructor (router: Router, connectionPool: Pool) {
    this.router = Router()
    this.connectionPool = connectionPool
    this.setup(router)
  }

  private getName (): string {
    return this.constructor.name.toLowerCase()
  }

  private setup (router: Router): void {
    router.use('/' + this.getName(), this.router)
    this.router.get('/', (req: Request, res: Response) => BaseService.send(res, HttpStatus.NoContent))
  }

  public dynamicRequest (self: BaseService): void {
    let methods = BaseService.getMethods(self)
    for (let name of methods) {
      this.router.get('/' + name, (req: Request, res: Response, next: NextFunction) => {
        let params: string[] = BaseService.getParameters(name, self[name].toString())
        if (!BaseService.checkQuery(req.query, params)) return BaseService.send(res, HttpStatus.BadRequest)
        if (params.length > 1) req.query = BaseService.orderQuery(req.query, params)
        self[name].apply(self, Object.values(req.query))
          .then((body: ServiceResponse) => BaseService.send(res, body.status, body.response))
          .catch(next)
      })
    }
    this.router.use((req: Request, res: Response, next: NextFunction) => {
      let breadcrumbs: string[] = req.path.substr(1).split('/')
      if (breadcrumbs[breadcrumbs.length - 1] === '') breadcrumbs.pop()
      return breadcrumbs.length === 1 ? BaseService.send(res, HttpStatus.NotImplemented) : next()
    })
  }

  static getMethods (self): string[] {
    let methods: string[] = Object.getOwnPropertyNames(Object.getPrototypeOf(self))
    methods.shift()
    return methods
  }

  static getParameters (name: string, methodString: string): string[] {
    let pattern: RegExp = new RegExp(name + '\\s*\\((.*)\\)')
    let params = []
    if (methodString.match(pattern)[1].split(',')[0].length) {
      params = methodString.match(pattern)[1].split(',')
      for (let i = 0; i < params.length; i++) params[i] = params[i].trim()
    }
    return params
  }

  static checkQuery (query: Object, args: string[]): boolean {
    if (Object.keys(query).length !== args.length) return false
    for (let arg of args) if (!(arg in query)) return false
    return true
  }

  static orderQuery (query: Object, order: string[]): Object {
    let newQuery: Object = {}
    for (let name of order) newQuery[name] = query[name]
    return newQuery
  }

  static send (res: Response, status: HttpStatus, response = {}): void {
    status === HttpStatus.OK || status === HttpStatus.Created || status === HttpStatus.MovedPermanently ? res.status(status).json(response) : res.sendStatus(status)
  }
}
