# Grunt Jboss AS Sample Example
> This folder contains an example which depicts how to use the grunt-jboss-as Grunt plugin.

Specifically this example uses the grunt-jboss-as plugin to:

* Download and extract JBoss AS
* Start JBoss AS with customized JVM parameters, custom HTTP/HTTPS ports and setup a keystore
* Build a Maven project
* (Re)deploy an archive on JBoss AS
* Kill the JBoss AS process

The `default` task is a showcase task which executes the above tasks and runs some QUnit Test Suites which contain CORS/JSONP tests for the Aerogear JS library. In order to execute it you need to clone the [aerogear-js-cors-jsonp-tests](https://github.com/tolis-e/aerogear-js-cors-jsonp-tests) repository which contains the REST service used by our QUnit [tests](https://github.com/tolis-e/grunt-jboss-as/tree/master/example/tests/pipeline/cors-jsonp). In addition you have to change the configuration paths (`/home/travis/build/tolis-e`) inside [Gruntfile.js](https://github.com/tolis-e/grunt-jboss-as/tree/master/example/Gruntfile.js) so that they match your machine's file system paths.

Execution:

Install the required dependencies:

    npm install

Execute the `default` task:

    grunt
