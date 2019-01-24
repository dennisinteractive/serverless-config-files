'use strict';

const path = require('path')
const dot = require('dot-object')
const yaml = require('./yaml')

class ServerlessConfigFilesPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {}

    this.commands = {
      'config-file': {
        usage: 'Adds configuration to the config file specified in serversless.yml.',
        lifecycleEvents: ['set'],
        options: {
          set: {
            usage: 'Usage: config-file --set user=foo. If you want to use structured config, run config-file --set global.user.name=foo',
            required: true,
          }
        },
      },
    }

    this.hooks = {
      'config-file:set': this.configSet.bind(this),
      'after:config-file:set': this.afterConfigSet.bind(this),
    };
  }

  configSet() {
    let filePath = this.getConfigFile();
    return Promise.all([
      yaml.read(filePath).catch(error => error.code === 'ENOENT' ? {} : Promise.reject(error)),
      Promise.resolve()
    ]).then(data => {
      if (typeof data[0] == 'string')
        data = JSON.parse(data[0]);
      else
        data = {};

      let kv = this.options.set.split('=');
      dot.str(kv[0], kv[1], data);

      return yaml.write(filePath, data)
    })
  }

  afterConfigSet() {
    this.serverless.cli.log(`Generated ${this.getConfigFile()}`);
  }

  getConfigFile () {
    if (this.serverless.service.custom.configFile) {
      let filepath = this.serverless.service.custom.configFile
      if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
      }
      return filepath
    } else {
      return Promise.reject(new Error('You need to specify the config file in serverless.yml under custom.configFile'))
    }
  }
}

module.exports = ServerlessConfigFilesPlugin

