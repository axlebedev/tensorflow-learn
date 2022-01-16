export const SAMPLE_ACTION = 'settings/SAMPLE_ACTION'

const initialState = {
  args: null,
}

export default function settingsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SAMPLE_ACTION:
      return {
        ...state,
        args: action.args,
      }

    default:
      return state
  }
}
