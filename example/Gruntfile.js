/**
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: 'localhost'
                }
            }
        },
        servers: {
            jboss: {
                download: {
                    url: 'http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip',
                    targetDir: 'target'
                },
                extract : {
                    targetDir: 'target'
                },
                startup: {
                    options: {
                        //jbossHome: '',
                        httpPort: 8081,
                        httpsPort: 8444,
                        xms: '512m',
                        xmx: '1024m',
                        maxPermSize: '256m',
                        bindingAddress: '127.0.0.1',
                        keystoreAlias: 'aerogear',
                        keystorePassword: 'aerogear',
                        keystoreFile: '/home/travis/build/tolis-e/aerogear-js-cors-jsonp-tests/help-files/aerogear.keystore',
                        securityProtocol: 'TLSv1',
                        baseProcessId: 'jboss-as'
                    }
                },
                deploy: {
                    archive: '/home/travis/build/tolis-e/aerogear-js-cors-jsonp-tests/aerogear-rest-service/target/aerogear-rest-service.war'
                }
            }
        },
        maven: {
            build: {
                pom: '/home/travis/build/tolis-e/aerogear-js-cors-jsonp-tests/aerogear-rest-service/pom.xml'
            }
        },
        qunit: {
            jbossas: {
                files: [],
                options: {
                    urls: [
                        "http://localhost:<%= connect.server.options.port %>/tests/pipeline/cors-jsonp/rest-tests.html",
                        "http://localhost:<%= connect.server.options.port %>/tests/pipeline/cors-jsonp/secure-rest-tests.html"
                    ],
                    "--web-security": false,
                    "--ssl-protocol": "tlsv1",
                    "--ignore-ssl-errors": "yes"
                }
            }
        },
        jshint: {
            all: {
                src: [ "Gruntfile.js", "tests/pipeline/**/*.js" ],
                options: {
                    jshintrc: "../.jshintrc"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jboss-as');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', 'Execute the Aerogear JS CORS/JSONP tests against a REST service deployed on a JBoss AS instance', ['jshint', 'download-jboss-as', 'extract-jboss-as', 'start-jboss-as-default', 'maven-build-default', 'deploy-archive-jboss-as-default', 'connect', 'qunit:jbossas', 'stop-all-processes']);
};
