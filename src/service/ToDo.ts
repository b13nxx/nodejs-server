import { Router } from 'express'
import { Pool, MysqlError, FieldInfo } from 'mysql'
import HttpStatus from '../definition/HttpStatus'
import ServiceResponse from '../definition/ServiceResponse'
import BaseService from './BaseService'

export default class ToDo extends BaseService {
  constructor (router: Router, connectionPool: Pool) {
    super(router, connectionPool)
    this.dynamicRequest(this)
  }

  list (): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      this.connectionPool.query('SELECT * FROM todos', (error: MysqlError, results: any, fields: FieldInfo[]) => {
        if (error) return reject(error)

        resolve({
          status: HttpStatus.OK,
          response: results
        })
      })
    })
  }

  add (title: string, createdBy: string): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      resolve({
        status: HttpStatus.Created,
        response: 'New todo has been created'
      })
    })
  }

  del (id: number): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      resolve({
        status: HttpStatus.OK,
        response: 'You actually tried to erase me?'
      })
    })
  }
}
