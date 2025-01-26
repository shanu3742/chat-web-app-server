exports.errorHandler =  (err,req,res,next) => {
  
    console.error(err,'error from page');
    const statusCode = err.status || 500;
    const message = err.message||'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      message:message,
    })
  
  }