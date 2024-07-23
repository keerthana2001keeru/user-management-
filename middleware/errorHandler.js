const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Customize the response object based on the environment
    const response = {
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };
  
    // Send the response with a generic error message to the client
    res.status(err.status || 500).json(response);
  };
  
  module.exports = errorHandler;
  