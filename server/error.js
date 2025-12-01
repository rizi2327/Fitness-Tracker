
//utility error handler hai jo controller k error ko handle krta hai it sends error to next middleware
export const createError=(status,message)=>{
    const err=new Error();
    err.status=status;
    err.message=message;
    return err;
};