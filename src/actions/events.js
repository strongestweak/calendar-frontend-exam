import {
  GET_ALL_EVENTS,
} from 'constant'

import {
  getAllEvents,
  addEvent,
  editEvent,
  removeEvent,
} from 'services/events'

export const fetchEvents = () => async dispatch => {
  try {
    const payload = await getAllEvents()

    dispatch({
      type: GET_ALL_EVENTS,
      payload,
    })
  } catch (error) {
    console.log(error)
  }
}

export const addNewEvent = payload => async dispatch => {
  try {
    await addEvent(payload)
    const response = await getAllEvents()
    dispatch({
      type: GET_ALL_EVENTS,
      payload: response,
    })
  } catch (error) {
    console.log(error)
  }
}

export const updateEvent = payload => async dispatch => {
  try {
    await editEvent(payload)
    const response = await getAllEvents()
    dispatch({
      type: GET_ALL_EVENTS,
      payload: response,
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteEvent = payload => async dispatch => {
  try {
    await removeEvent(payload)
    const response = await getAllEvents()
    dispatch({
      type: GET_ALL_EVENTS,
      payload: response,
    })
  } catch (error) {
    console.log(error)
  }
}
