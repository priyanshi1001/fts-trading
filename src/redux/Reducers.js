import Utils from "../Utils";

const {
  GET_ALL_CONTENT,

  GET_CONTENT_LANGUAGE,
  GET_CONTENT_TRANSLATION,
 
} = Utils.ActionName;

let initialState = [];


export const getContentLanguageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTENT_LANGUAGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export const getAllContentTypeByIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CONTENT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export const getContentTranslationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTENT_TRANSLATION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const getAllContentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CONTENT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
