export const initialState = {
  sending: false,
  succeed: null,
  rejected: null,
  error: null,
};

const createReqReducer = constants => (state = initialState, action) => {
  const {
    SEND, SUCCEED, REJECTED, ERROR_ENCOUNTERED,
  } = constants;
  const { payload, type } = action;
  switch (type) {
    case SEND:
      return {
        ...initialState,
        sending: true,
      };
    case SUCCEED: {
      return Object.assign({},
        initialState,
        {
          succeed: true,
          rejected: false,
        },
        Array.isArray(payload)
          ? { list: payload }
          : { data: payload });
    }
    case REJECTED:
      return {
        ...initialState,
        ...payload,
        succeed: false,
        rejected: true,
      };
    case ERROR_ENCOUNTERED:
      return {
        ...initialState,
        succeed: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default createReqReducer;
