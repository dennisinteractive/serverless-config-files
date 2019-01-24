'use strict';

const path = require('path')
const yaml = require('./yaml')
const helper = require('./helper')

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
            usage: 'Usage: config-file --set user:foo. If you want to use structured config, run config-file --set global.user.name:foo',
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
      let newObj = helper.strToObj(this.options.set);

      if (typeof data[0] == 'string')
        data = data[0];
      else
        data = JSON.stringify({});

      let doc = helper.mergeRecursive([JSON.parse(data), JSON.parse(newObj)]);

      return yaml.write(filePath, doc)
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

