Docker
------

> boot2docker up
> docker run --name postgres
> docker run --name postgres -p 5432:5432 -d postgres
run as a daemon on postgres

> docker start postgres
end

> boot2docker ip
get ip of the machine

>docker rm $(name)
remove a docker image