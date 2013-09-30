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
var grunt = require('grunt'),
    serverProcesses = serverProcesses || {},
    StringModule = require('./string-module').StringModule;

module.exports.ProcessModule =
{
    put: function (id, process)
    {
        if (id && StringModule.trim(id) !== "" && process)
        {
            serverProcesses[id] = process;
        }
    },
    get: function (id)
    {
        return serverProcesses[id];
    },
    getSize: function () {
        return Object.keys(serverProcesses).length;
    },
    kill: function (id)
    {
        if (id && StringModule.trim(id) !== '' && serverProcesses[id] !== undefined)
        {
            grunt.log.writeln('==============================================================');
            serverProcesses[id].kill();
            delete serverProcesses[id];
            grunt.log.writeln(['ProcessModule: kill: Killed process id: ', id, '.'].join(''));
            grunt.log.writeln('==============================================================');
        }
        else
        {
            grunt.log.writeln('==============================================================');
            grunt.log.writeln(['ProcessModule: kill:  SIGKILL signal to process id: ', id, '.'].join(''));
            grunt.log.writeln('==============================================================');
            process.kill(id, 'SIGKILL');
        }
    },
    killAll: function ()
    {
        for (var p in serverProcesses)
        {
            grunt.log.writeln('==============================================================');
            serverProcesses[p].kill();
            delete serverProcesses[p];
            grunt.log.writeln(['ProcessModule: killAll: Killed process id: ', p, '.'].join(''));
            grunt.log.writeln('==============================================================');
        }
    }
};
