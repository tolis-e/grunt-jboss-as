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
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*
        servers: {
            jboss: {
                download: {
                    url: 'http://download.jboss.org/jbossas/7.1/jboss-as-7.1.1.Final/jboss-as-7.1.1.Final.zip',
                    targetDir: 'target'
                },
                extract: {
                    targetDir: 'target'
                },
                startup: {
                    options: {
                        jbossHome: '',
                        httpPort: 8080,
                        httpsPort: 8443,
                        xms: '512m',
                        xmx: '1024m',
                        maxPermSize: '256m',
                        bindingAddress: '127.0.0.1',
                        keystoreAlias: '',
                        keystorePassword: '',
                        keystoreFile: '',
                        securityProtocol: '',
                        baseProcessId: 'jboss-as'
                    }
                },
                deploy: {
                    archive: ''
                }
            }
        },
        maven: {
            build: {
                pom: ''
            }
        },
        */
        jshint: {
            all: {
                src: [ "Gruntfile.js", "src/**/*.js", "tasks/*.js" ],
                options: {
                    jshintrc: ".jshintrc"
                }
            }
        }
    });
    
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};
