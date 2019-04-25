import { NextFunction, Request, Response, Router } from 'express'
import HttpStatus from '../definition/HttpStatus'
import ServiceResponse from '../definition/ServiceResponse'

export default class BaseService {
  private router: Router

  constructor (router: Router) {
    this.setRouter(Router())
    this.setup(router)
  }

  setRouter (router: Router) {
    this.router = router
  }

  getRouter (): Router {
    return this.router
  }

  getName (): string {
    return this.constructor.name.toLowerCase()
  }

  setup (router: Router): void {
    this.getRouter().get('/', (req: Request, res: Response) => BaseService.send(res, HttpStatus.NoContent))
    this.checkIfMethodExists()
    router.use('/' + this.getName(), this.getRouter())
  }

  dynamicRequest (methods: string[]): void {
    for (let name of methods) {
      this.getRouter().get('/' + name, (req: Request, res: Response) => {
        let args: string[] = BaseService.getParameters(name, this[name])
        if (!BaseService.checkQuery(req.query, args)) return BaseService.send(res, HttpStatus.BadRequest)
        req.query = BaseService.orderQuery(req.query, args)
        let body: ServiceResponse = this[name].apply(null, Object.values(req.query))
        BaseService.send(res, body.status, body.response)
      })
    }
    this.getRouter().use((er, req, res, next) => BaseService.send(res, HttpStatus.InternalServerError))
  }

  checkIfMethodExists (): void {
    this.getRouter().use((req: Request, res: Response, next: NextFunction) => {
      let breadcrumbs: string[] = req.path.substr(1).split('/')
      if (breadcrumbs[breadcrumbs.length - 1] === '') breadcrumbs.pop()
      if (breadcrumbs.length > 1) return BaseService.send(res, HttpStatus.NotFound)
      if (!BaseService.getMethods(this).includes(breadcrumbs[0])) return BaseService.send(res, HttpStatus.NotImplemented)
      next()
    })
  }

  static getMethods (self): string[] {
    let methods: string[] = Object.getOwnPropertyNames(Object.getPrototypeOf(self))
    methods.shift()
    return methods
  }

  static getParameters (name: string, method: Function): string[] {
    let str: string = method.toString()
    let pattern: RegExp = new RegExp(name + '\\s*\\((.*)\\)')
    let args: string[] = str.match(pattern)[1].split(',')
    for (let i = 0; i < args.length; i++) args[i] = args[i].trim()
    return args
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
