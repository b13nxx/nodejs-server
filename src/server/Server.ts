import * as express from 'express'
import * as mysql from 'mysql'
import { config } from 'dotenv'
import { Dirent, readdirSync } from 'fs'
import HttpStatus from '../definition/HttpStatus'

class Server {
  private app: express.Application
  private router: express.Router
  private connectionPool: mysql.Pool

  constructor () {
    this.app = express()
    this.router = express.Router()
    this.connectionPool = mysql.createPool({
      host: 'localhost',
      user     : 'root',
      password : 'mysql',
      database : 'my_db',
      connectionLimit: 10
    })
    config()
    this.setup(process.env.PORT)
  }

  private listen (port: string): void {
    this.app.listen(port, () => {
      console.log('Server running on port ' + port)
    })
  }

  private setup (port: string): void {
    this.listen(port)
    this.app.use('/api', this.router)
    this.router.get('/', (req: express.Request, res: express.Response) => res.sendStatus(HttpStatus.NoContent))
    this.load()
    this.router.use((req: express.Request, res: express.Response) => res.sendStatus(HttpStatus.NotFound))
    this.router.use((er, req, res, next) => res.sendStatus(HttpStatus.InternalServerError))
  }

  private load (): void {
    for (let service of Server.getServices()) {
      service = require('../service/' + service).default
      // @ts-ignore
      service = new service(this.router, this.connectionPool)
    }
  }

  static getServices (): string[] {
    let names: string[] = []
    let info
    for (let file of readdirSync('./src/service')) {
      info = file.split('.')
      info.ext = info.pop()
      info.name = info.join('')
      if (info.name !== 'BaseService' && info.ext === 'js') names.push(info.name)
    }
    return names
  }
}

const server = new Server()
