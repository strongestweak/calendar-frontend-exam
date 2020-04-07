import {
  GET_ALL_EVENTS,
} from 'constant'

const initialState = {
  reload: 0,
  events: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
  case GET_ALL_EVENTS: {
    return {
      ...state,
      reload: state.reload + 1,
      events: action.payload,
    }
  }
  default:
    return state
  }
}
