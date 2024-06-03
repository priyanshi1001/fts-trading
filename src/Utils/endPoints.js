const endPoint = {
   LOGIN: "Account/SignIn",
   SIGNUP: "Account/SignUp",
   USER:"Account/GetUser",
   ALL_USER:"Account/GetAllUser",
   

  //Content API
  GET_ALL_CONTENT: "ContentManagement/GetAllContent",
  GET_CONTENT_BY_ID: "ContentManagement/GetContentById",
  UPDATE_CONTENT: "ContentManagement/Update",
  IMPORT_CONTENT:"ContentManagement/Import",
  EXPORT_CONTENT:"ContentManagement/Export",
  GET_CONTENT_LANGUAGE:"ContentManagement/GetAllLanguage",
  GET_CONTENT_TRANSLATION:"ContentManagement/GetContentTranslation",
  POST_CONTENT_TRANSLATION:"ContentManagement/InsertContentTranslation",
  GET_INCOME_CODE:"/Countries/GetAllIncomeCodes",

 
  
};

export default endPoint;
