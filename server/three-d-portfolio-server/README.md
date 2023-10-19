# three-d-portfolio-server Project

## About File Upload

The server needs a folder to store uploaded files. When it runs on docker, this should be a mounted Persistent Volume

The location is defined in application.properties

```properties
three-3.file.upload.path=/srv/upload
%dev.three-3.file.upload.path=./file
```