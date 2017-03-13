#created by miaojing-243127395@qq.com on 2016-11-09 17:58:58

# see https://www.tutorialspoint.com/makefile/makefile_dependencies.htm
# for more info on Makefile
PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash


PATH_SRC_ROOT := server
PATH_SRC_TEST := test

PATH_BUILD_ROOT := build/$(PATH_SRC_ROOT)
PATH_BUILD_TEST := build/$(PATH_SRC_TEST)


PATH_PRJ_ROOT := $$(pwd)
PATH_LOG := $(PATH_PRJ_ROOT)/blob/logs/myapp.log


.PHONY: test

clean:
	rm -rf blob/logs
	mkdir -p blob/logs
	rm -rf build
	
copy-res:
	/bin/bash ./scripts/copy-res.sh

compile: clean tsc copy-res

run: clean compile bare-run

bare-run:
	@printf "server started on port $(DOCKER_NODE_PORT)\n"
	nodemon $(PATH_BUILD_ROOT)/index.js > $(PATH_LOG)

run-debug:
	nodemon --inspect $(PATH_BUILD_ROOT)/index.js

inspect:
	inspect $(PATH_BUILD_ROOT)/index.js

test: clean compile test-unit test-functional
	
test-unit:
	NODE_ENV=test TEST_OVERRIDE=test time -p ava  --serial --verbose --timeout=10s $(PATH_BUILD_ROOT)/**/*_stest.js
	NODE_ENV=test TEST_OVERRIDE=test time -p ava --verbose --timeout=10s $(PATH_BUILD_ROOT)/**/*_test.js
	
	
test-functional: 
	NODE_ENV=test ava --serial --verbose $(PATH_BUILD_TEST)/functional/serial_test.js
	NODE_ENV=test ava --verbose $(PATH_BUILD_TEST)/functional/non_serial_test.js

testw: tsc
	NODE_ENV=test mocha --recursive --watch $(PATH_BUILD_TEST) $(PATH_BUILD_ROOT)

# kill ava process if failed
# npm install --global inspect-process
test-debug: 
	NODE_ENV=test inspect node_modules/ava/profile.js build/test/functional/api/api_base_test.js


tsc:
	tsc

tscw:
	tsc -w

tsct:
	tsc -w --traceResolution

# create lint by
# tslint --init
lint:
	tslint --format verbose --project .

readlog:
	tail -f $(PATH_LOG) | pino -lt


docker_init_mongo:
	docker run --name some-mongo -p 27017:27017 -d mongo

git_merge_master:
	git checkout master
	git merge dev
	git checkout dev