import { useEffect, useReducer } from "react";

const INIT = {
  result: [],
  error: null,
  loading: false,
};
// ACTION TYPES
const GET_RESULT = "GET_RESULT";
const SET_ERROR = "SET_ERROR";
const SET_LOADING = "SET_LOADING";
const RESET_VALUE = "RESET_VALUE";

const reducer = (state = INIT, action) => {
  switch (action.type) {
    case GET_RESULT:
      return { ...state, result: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case RESET_VALUE:
      return INIT;
    default:
      return state;
  }
};

const setResult = (payload) => ({ type: GET_RESULT, payload });
const setLoading = (payload) => ({ type: SET_LOADING, payload });
const setError = (payload) => ({ type: SET_ERROR, payload });
const reset = () => ({ type: RESET_VALUE });

const useImmediate = (path, dependency = [], cleanupCallback) => {
  const [state, dispatch] = useReducer(reducer, INIT);
  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      try {
        const { data } = await API.get(path);
        dispatch(setResult(data));
      } catch (err) {
        dispatch(setError(err));
      } finally {
        dispatch(setLoading(false));
      }
    })();
    return () => {
      cleanupCallback?.();
      dispatch(reset);
    };
  }, dependency);

  return state;
};

export default useImmediate;
