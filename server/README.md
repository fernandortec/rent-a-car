# Running with Docker

From the repository root, build and run the server:

```sh
docker build -t rentacar-server ./server
docker run --rm -p 8080:8080 rentacar-server
```

The image builds and tests the application with Apache Maven and Java 25, then
runs it on a Java 25 runtime. The server listens on port 8080. No application
endpoints are defined yet, so a request to `/` will return 404 until one is added.

The original Gradle build is also available; keep its dependencies in sync with
`pom.xml` when changing the application.
