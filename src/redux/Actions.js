
import { useParams } from "react-router-dom";
import {
  SET_ENABLE_BACKGROUND_IMAGE,
  SET_ENABLE_MOBILE_MENU,
  SET_ENABLE_MOBILE_MENU_SMALL,
  SET_ENABLE_FIXED_HEADER,
  SET_ENABLE_HEADER_SHADOW,
  SET_ENABLE_SIDEBAR_SHADOW,
  SET_ENABLE_FIXED_SIDEBAR,
  SET_ENABLE_CLOSED_SIDEBAR,
  SET_ENABLE_FIXED_FOOTER,
  SET_ENABLE_PAGETITLE_ICON,
  SET_ENABLE_PAGETITLE_SUBHEADING,
  SET_ENABLE_PAGE_TABS_ALT,
  SET_BACKGROUND_IMAGE,
  SET_BACKGROUND_COLOR,
  SET_COLOR_SCHEME,
  SET_BACKGROUND_IMAGE_OPACITY,
  SET_HEADER_BACKGROUND_COLOR,
 
} from "./actionName";

import Utils from "../Utils";
import { ca } from "date-fns/locale";
import constants from "../Utils/constants";



export const signupAction = (value) => {
  return (dispatch) => {
    const dataToSend = { message: value };
    Utils.api.postApiCall(
      Utils.endPoints.SIGNUP,
      value,
      (responseData) => {
        let { data } = responseData;
        dispatch({
          type: Utils.ActionName.SIGNUP,
          payload: { data: data.data },
        });
         if (responseData) {
          Utils.showAlert(1, "User Registered successfully");
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data.message);
      }
    );
  };
};



export const loginAction = (value,callback) => {
  return (dispatch) => {
    const dataToSend = { message: value };
    Utils.api.postApiCall(
      `${ Utils.endPoints.LOGIN}`,

      value,
      (responseData) => {
      
        if(responseData.status == 200){
         
          localStorage.setItem('accessToken',responseData.data.token.accessToken)
          localStorage.setItem('userDetails',JSON.stringify(responseData.data))
          Utils.showAlert(1, "Logged in Succesfully");
        
          setTimeout(() => {
            callback();
          }, 1000); 
        
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data.error);
      }
    );
  };
};






export const getAllContentType = (page,size,search) => {
  let params= `?pageNumber=${page}&pageSize=${size}`
  if(search){
    params=`?searchTerm=${search}&pageNumber=${page}&pageSize=${size}`
  }
  return (dispatch) => {
    Utils.api.getApiCall(
      Utils.endPoints.GET_ALL_CONTENT,
      params,
      (resData) => {
        const { data } = resData;
        if (resData.status === 200) {
          dispatch({
            type: Utils.ActionName.GET_ALL_CONTENT,
            payload: {
              contentData: resData.data,
            },
          });
        } else {
          Utils.showAlert(2, resData.message);
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data.message);
      }
    );
  };
};



export const getContentLanguageById = (value,callback) => {
  return (dispatch) => {
    Utils.api.getApiCall(
      Utils.endPoints.GET_CONTENT_LANGUAGE,
      `?contentId=${value}`,
      (resData) => {
        const { data } = resData;
        if (resData.status === 200) {
          if (callback) {
            callback(resData?.data)
          }
          
          dispatch({
            type: Utils.ActionName.GET_CONTENT_LANGUAGE,
            payload: {
              languageContentId: resData.data,
            },
          });
          return Promise.resolve(resData.data);
        } else {
          // Utils.showAlert(2, resData.message);
        }
      },
      (error) => {
        let { data } = error;
        // Utils.showAlert(2, data.message);
      }
    );
  };
};





export const getAllContent = () => {
  return (dispatch) => {
    Utils.api.getApiCall(
      Utils.endPoints.GET_ALL_CONTENT,
      "",
      (resData) => {
        const { data } = resData;
        if (resData.status === 200) {
          dispatch({
            type: Utils.ActionName.GET_ALL_CONTENT,
            payload: {
              usTinData: resData.data,
            },
          });
        } else {
          Utils.showAlert(2, data.message);
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data.message);
      }
    );
  };
};






export const updateUser = (value) => {
  return (dispatch) => {
    // const dataToSend = { message: value };
    Utils.api.postApiCall(
      Utils.endPoints.UPDATE_USER,
      value,"",
      (responseData) => {
        let { data } = responseData;
        dispatch({
          type: Utils.ActionName.UPDATE_USER,
          payload: { data: data.data },
        });
        if (responseData) {
          Utils.showAlert(1, responseData?.data);
        }
      },
      (error) => {
        Utils.showAlert(2, error.statusText);
      }
    );
  };
};

export const changePassword = (value) => {
  return (dispatch) => {
    const dataToSend = { message: value };
    Utils.api.postApiCall(
      Utils.endPoints.CHANGE_PASSWORD,
      value,"",
      (responseData) => {
        let { data } = responseData;
        dispatch({
          type: Utils.ActionName.CHANGE_PASSWORD,
          payload: { data: data.data },
        });
         if (responseData) {
          console.log(responseData,"res")
          Utils.showAlert(1, responseData?.data?.message);
          if(responseData?.data?.message !== ""){
            // callback();
          }
        }
      },
      (error) => {
        Utils.showAlert(2, error.statusText);
      }
    );
  };
};



export const getContentTranslation = (questionId, languageId, callback) => {
  return dispatch => {
    Utils.api.getApiCall(
      Utils.endPoints.GET_CONTENT_TRANSLATION,
      `?contentId=${questionId}&languageId=${languageId}`,
      resData => {
        if (resData.status === 200) {
          if (callback) {
            callback(resData.data)
          }
          dispatch({
            type: Utils.ActionName.GET_CONTENT_TRANSLATION,
            payload: {
              contentTranslationData: resData.data
            }
          })
        }
      },
      error => {
        let { data } = error
        Utils.showAlert(2, data.message)
      }
    )
  }
}


export const importContent = (value) => {
  return (dispatch) => {
    const dataToSend = { message: value };
    Utils.api.postApiCall(
      Utils.endPoints.IMPORT_CONTENT,
      value,
      (responseData) => {

        let { data } = responseData;
        dispatch({
          type: Utils.ActionName.IMPORT_CONTENT,
          payload: { data: data.data },
        });
        if (responseData) {
          Utils.showAlert(1, responseData?.data);
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data);
      },
      "multi"
    );
  };
};




export const getContentById = (value,callback) => {
  return (dispatch) => {
    Utils.api.getApiCall(
      Utils.endPoints.GET_CONTENT_BY_ID,
      `?id=${value}`,
      (resData) => {
        if (resData.status === 200) {
          if(callback){
            callback(resData.data)
          }
          dispatch({
            type: Utils.ActionName.GET_CONTENT_BY_ID,
            payload: {
              ContentById: resData.data,
            },
          });
        } else {
          Utils.showAlert(2, resData.message);
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data.message);
      }
    );
  };
};




export const updateContent = (value) => {
  return (dispatch) => {
    const dataToSend = { message: value };
    Utils.api.putApiCall(
      Utils.endPoints.UPDATE_CONTENT,
      value,"",
      (responseData) => {
        let { data } = responseData;
        dispatch({
          type: Utils.ActionName.UPDATE_CONTENT,
          payload: { data: data.data },
        });
         if (responseData) {
           Utils.showAlert(1, "Content Updated Successfully");
        }
      },
      (error) => {
        let { data } = error;
        Utils.showAlert(2, data.message);
      }
    );
    
  };
};











export const setEnableBackgroundImage = (enableBackgroundImage) => ({
  type: SET_ENABLE_BACKGROUND_IMAGE,
  enableBackgroundImage,
});

export const setEnableFixedHeader = (enableFixedHeader) => ({
  type: SET_ENABLE_FIXED_HEADER,
  enableFixedHeader,
});

export const setEnableHeaderShadow = (enableHeaderShadow) => ({
  type: SET_ENABLE_HEADER_SHADOW,
  enableHeaderShadow,
});

export const setEnableSidebarShadow = (enableSidebarShadow) => ({
  type: SET_ENABLE_SIDEBAR_SHADOW,
  enableSidebarShadow,
});

export const setEnablePageTitleIcon = (enablePageTitleIcon) => ({
  type: SET_ENABLE_PAGETITLE_ICON,
  enablePageTitleIcon,
});

export const setEnablePageTitleSubheading = (enablePageTitleSubheading) => ({
  type: SET_ENABLE_PAGETITLE_SUBHEADING,
  enablePageTitleSubheading,
});

export const setEnablePageTabsAlt = (enablePageTabsAlt) => ({
  type: SET_ENABLE_PAGE_TABS_ALT,
  enablePageTabsAlt,
});

export const setEnableFixedSidebar = (enableFixedSidebar) => ({
  type: SET_ENABLE_FIXED_SIDEBAR,
  enableFixedSidebar,
});

export const setEnableClosedSidebar = (enableClosedSidebar) => ({
  type: SET_ENABLE_CLOSED_SIDEBAR,
  enableClosedSidebar,
});

export const setEnableMobileMenu = (enableMobileMenu) => ({
  type: SET_ENABLE_MOBILE_MENU,
  enableMobileMenu,
});

export const setEnableMobileMenuSmall = (enableMobileMenuSmall) => ({
  type: SET_ENABLE_MOBILE_MENU_SMALL,
  enableMobileMenuSmall,
});

export const setEnableFixedFooter = (enableFixedFooter) => ({
  type: SET_ENABLE_FIXED_FOOTER,
  enableFixedFooter,
});

export const setBackgroundColor = (backgroundColor) => ({
  type: SET_BACKGROUND_COLOR,
  backgroundColor,
});

export const setHeaderBackgroundColor = (headerBackgroundColor) => ({
  type: SET_HEADER_BACKGROUND_COLOR,
  headerBackgroundColor,
});

export const setColorScheme = (colorScheme) => ({
  type: SET_COLOR_SCHEME,
  colorScheme,
});

export const setBackgroundImageOpacity = (backgroundImageOpacity) => ({
  type: SET_BACKGROUND_IMAGE_OPACITY,
  backgroundImageOpacity,
});

export const setBackgroundImage = (backgroundImage) => ({
  type: SET_BACKGROUND_IMAGE,
  backgroundImage,
});
