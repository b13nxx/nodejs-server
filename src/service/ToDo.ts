import { Router } from 'express'
import { Pool } from 'mysql'
import HttpStatus from '../definition/HttpStatus'
import BaseService from './BaseService'

export default class ToDo extends BaseService {
  constructor (router: Router, connectionPool: Pool) {
    super(router, connectionPool)
    this.dynamicRequest(this)
  }

  list () {
    return new Promise((resolve, reject) => {
      this.connectionPool.query('SELECT * FROM todos', (error, results, fields) => {
        if (error) return reject(error)

        resolve({
          status: HttpStatus.OK,
          response: results
        })
      })
    })
  }

  add (title: string, createdBy: string) {
    return new Promise((resolve, reject) => {
      resolve({
        status: HttpStatus.Created,
        response: 'New todo has been created'
      })
    })
  }

  del (id: number) {
    return new Promise((resolve, reject) => {
      resolve({
        status: HttpStatus.OK,
        response: 'You actually tried to erase me?'
      })
    })
  }
}
