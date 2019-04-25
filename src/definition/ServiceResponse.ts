import HttpStatus from './HttpStatus'

type ServiceResponse = {
  status: HttpStatus,
  response: Array<Object> | Object
}

export default ServiceResponse
