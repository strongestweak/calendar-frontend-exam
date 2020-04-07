import client from './index'

const getAllEvents = () => client.get(`/`)

const addEvent = payload => client.post(`/`, payload)

const editEvent = payload => client.patch(`/${payload.id}`, payload)

const removeEvent = payload => client.delete(`/${payload.id}`)

export {
  getAllEvents,
  addEvent,
  editEvent,
  removeEvent,
}
