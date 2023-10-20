# three-d-portfolio-server Project

## About Image Files uploaded and shown by the application

The server needs a folder to store uploaded files. Files also can be downloaded from that Folder.

When the application runs on docker as a jar we cannot write or read directly from the this jar file. In the cloud be even need a mounted Persistent Volume to be able to save files.

Due to that the location is defined in [application.properties](./src/main/resources/application.properties#images)

```properties
three-3.file.upload.path=/srv/upload
%dev.three-3.file.upload.path=./target/files
```

To make this explicit and allow uploads in development mode we copy the required files from the resources folder to the ./target/files directory for development.
When we deploy to kubernetes we copy these files to a persistent volume.

For testing the download see [api.http](./api/api.http).

