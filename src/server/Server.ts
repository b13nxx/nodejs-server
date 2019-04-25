import * as express from 'express'
import { config } from 'dotenv'
import { Dirent, readdirSync } from 'fs'
import HttpStatus from '../definition/HttpStatus'

class Server {
  private app: express.Application
  private router: express.Router
  private port: string

  constructor () {
    this.setApp(express())
    this.setRouter(express.Router())
    config()
    this.setup(process.env.PORT)
  }

  setApp (app: express.Application) {
    this.app = app
  }

  getApp (): express.Application {
    return this.app
  }

  setRouter (router: express.Router) {
    this.router = router
  }

  getRouter (): express.Router {
    return this.router
  }

  listen (port: string): void {
    this.getApp().listen(port, () => {
      console.log('Server running on port ' + port)
    })
  }

  setup (port: string): void {
    this.listen(port)
    this.getApp().use('/api', this.getRouter())
    this.getRouter().get('/', (req: express.Request, res: express.Response) => res.sendStatus(HttpStatus.NoContent))
    this.load()
    this.getRouter().use((req: express.Request, res: express.Response) => res.sendStatus(HttpStatus.NotFound))
  }

  load (): void {
    for (let service of Server.getServices()) {
      service = require('../service/' + service).default
      // @ts-ignore
      service = new service(this.getRouter())
    }
  }

  static getServices (lowerCase = false): string[] {
    let names: string[] = []
    let info
    for (let file of readdirSync('./src/service')) {
      info = file.split('.')
      info.ext = info.pop()
      info.name = info.join('')
      if (info.name !== 'BaseService' && info.ext === 'js') names.push(lowerCase ? info.name.toLowerCase() : info.name)
    }
    return names
  }
}

const server = new Server()
