import { Router, Request, Response } from 'express'
import HttpStatus from '../definition/HttpStatus'
import ServiceResponse from '../definition/ServiceResponse'
import BaseService from './BaseService'

export default class ToDo extends BaseService {
  constructor (router: Router) {
    super(router)
    this.dynamicRequest(BaseService.getMethods(this))
  }

  add (title: string, createdBy: string): ServiceResponse {
    return {
      status: HttpStatus.Created,
      response: 'New todo has been created'
    }
  }

  del (id: number): ServiceResponse {
    return {
      status: HttpStatus.OK,
      response: 'You actually tried to erase me?'
    }
  }
}
