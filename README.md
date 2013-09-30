# grunt-jboss-as [![Build Status](https://travis-ci.org/tolis-e/grunt-jboss-as.png?branch=0.1.0)](https://travis-ci.org/tolis-e/grunt-jboss-as)
> This project contains a Grunt plugin which includes tasks to:

* Download and extract JBoss AS
* Start JBoss AS with customized JVM parameters, custom HTTP/HTTPS ports and an optional keystore
* Build a Maven project
* (Re)deploy an archive on JBoss AS
* Kill a process

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jboss-as --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jboss-as');
```

## download-jboss-as task
> This task downloads the [jboss-as-7.1.1.Final](http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip) file and stores it inside the `target` destination directory.

```js
grunt.initConfig({
    servers: {
        jboss: {
            download: {
                url: 'http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip',
                targetDir: 'target'
            }
        }
    }
});
```
### Options

#### url
Type: `String`  
Description: `The URL to download the JBoss AS zip from`  
Default: `http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip`

#### targetDir
Type: `String`  
Description: `The target directory in which the JBoss AS zip is stored`  
Default: `target`

## extract-jboss-as task
> This task extracts the JBoss AS zip file in the configured target directory.

```js
grunt.initConfig({
    servers: {
        jboss: {
            extract : {
                targetDir: 'target'
            }
        }
    }
});
```
### Options

#### targetDir
Type: `String`  
Description: `The target directory to host the extracted JBoss AS contents`  
Default: `'target'`

## start-jboss-as-default task
> This task starts the JBoss AS in standalone mode, sets the configured ports, JVM parameters and keystore, using the grunt init configuration.

```js
grunt.initConfig({
    servers: {
        jboss: {
            startup: {
                options: {
                    httpPort: 8081,
                    httpsPort: 8444,
                    xms: '512m',
                    xmx: '1024m',
                    maxPermSize: '256m',
                    bindingAddress: '127.0.0.1',
                    keystoreAlias: 'aerogear',
                    keystorePassword: 'aerogear',
                    keystoreFile: '/home/aemmanou/git-repos/aerogear-js-cors-jsonp-tests/help-files/aerogear.keystore',
                    securityProtocol: 'TLSv1',
                    baseProcessId: 'jboss-as'
                }
            }
        }
    }
});
```

### Options

#### httpPort
Type: `Integer`  
Description: `The HTTP port`  
Default: `8080`

#### httpsPort
Type: `Integer`  
Decsription: `The HTTPS port`  
Default: `8443`

#### xms
Type: `String`  
Description: `Specify the initial size, in bytes, of the memory allocation pool`  
Default: `64m`

#### xmx
Type: `String`  
Description: `Specify the maximum size, in bytes, of the memory allocation pool`  
Default: `512m`

#### maxPermSize
Type: `String`  
Description: `Max size of the separate area of the heap called Permanent Generation space`  
Default: `256m`

#### bindingAddress
Type: `String`  
Description: `Indicate the address where services should be listening`  
Default: `127.0.0.1`

#### keystoreAlias
Type: `String`  
Description: `The alias used to for the server certificate in the keystore`  
Default: -

#### keystorePassword
Type: `String`  
Decsription: `Password for both trustore and keystore`  
Default: -

#### keystoreFile
Type: `String`  
Decsription: `The pathname of the keystore file where you have stored the server certificate to be loaded`  
Default: ``

#### securityProtocol
Type: `String`  
Decsription: `The version of the SSL protocol to use. If not specified, Supported values: SSLv2, SSLv3, TLSv1, SSLv2+SSLv3 and ALL`  
Default: -

#### baseProcessId
Type: `String`  
Description: `The prefix of the JBoss AS process - used internally from the plugin`  
Default: -

## start-jboss-as task
> This task can be used as a standalone task in order to start a JBoss AS instance, set the configured ports, JVM parameters and keystore. It receives as input the following arguments in order: `jbossHome`, `xms`, `xmx`, `permSize`, `bindingAddress`, `httpPort`, `httpsPort`, `keystoreAlias`, `keystorePassword`, `keystoreFile`, `securityProtocol`. You can execute it by using:

_`grunt start-jboss-as:/home/user/jbosss-7.1.1.Final`_

You can pass more arguments by adding `:` and the argument's value. For instance, in order to startup a JBoss AS instance using the `xms` and `xmx` JVM parameters you have to execute:

_`grunt start-jboss-as:/home/user/jbosss-7.1.1.Final:128m:1024m`_

Note the JBoss AS pid is printed in the stdout: `[INFO] start-jboss-as: =====> process id: '__3835'`. You can use the pid number e.g 3835 in order to kill the process, by using the `stop-process` task:

_`grunt stop-process:3835`_

## maven-build-default task
> This task cleans & builds the configured mavenized project.

```js
grunt.initConfig({
    maven: {
        build: {
            pom: '/home/user/myproject/pom.xml'
        }
    }
});
```

### Options

#### pom
Type: `String`  
Description: `The POM file's absolute path`  
Default: -

## maven-build task
> This task receives the pom file path as input and cleans/builds the mavenized project. It can be executed using:

_`grunt maven-build:/home/user/myproject/pom.xml`_

## deploy-archive-jboss-as-default task
> This task (re)deploys an archive to the default configured JBoss AS instance (the one which was downloaded and extracted by the above mentioned tasks).

```js
grunt.initConfig({
    servers: {
        jboss: {
            deploy: {
                archive: '/home/user/myproject/target/myproject.war'
            }
        }
    }
});
```

### Options

#### archive
Type: `String`  
Description: `The absolute path of the archive which is going to be (re)deployed on the JBoss AS`  
Default: -

## stop-all-processes task
> This task is used to kill the processes created by the current plugin and more specifically the JBoss AS process. It should not be executed as standalone task.

## stop-process task
> This task can be used to kill a process. It can be executed as a standalone task using:

_`grunt stop-process:pid`_

## Example
> The [example](https://github.com/tolis-e/grunt-jboss-as/tree/master/example) folder contains a sample example which depicts how to use this plugin.

## Release History

### 0.1.0
*Released 30 September 2013*

* Initial release
