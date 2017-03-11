
# mongodb



## mongodb query language:
https://docs.mongodb.com/manual/tutorial/query-documents/

    db.users.find()
    db.users.drop()


install mac gui client: robomongo


## tutorial

https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose

## Notes

* mongoose promise: 
    http://mongoosejs.com/docs/promises.html
    * query is not promise, but do have a `then` method use `exec`

* debug mongoose:
    edit file  server/db/mongoose.ts


## docker mongo
https://hub.docker.com/_/mongo/


    docker pull mongo

    docker run --name some-mongo -p 27017:27017 -d mongo

## Links
*  http://mongoosejs.com/docs/schematypes.html
*  http://mongoosejs.com/docs/validation.html
