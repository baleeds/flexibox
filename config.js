// Update the values here to correspond to your local system

var config = {
   server: {
      host: "localhost",
      port: "8080"
   },
   // TODO: need a new REST api to serve up the image files before specifying an upload directory outside
   // the webapp will work.  Right now the images can be rendered using relative URL's because they are in
   // the webapp directory but as soon as they are outside that directory, this will break.
   uploadsDir: "uploads/"
   //uploadsDir: "/data/flexiboxUploads/" 
};

module.exports = config;
