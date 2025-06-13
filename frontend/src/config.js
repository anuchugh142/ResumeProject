const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  MAX_FILE_SIZE: process.env.REACT_APP_MAX_FILE_SIZE || 5242880, // 5MB in bytes
};

export default config; 