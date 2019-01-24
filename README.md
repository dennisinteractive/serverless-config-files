Serverless Config Files Plugin
=======

A Serverless plugin to create config files to be used as variables in serverless.yml

### Key features:

- Provides a command to add or append configuration
- Support for structured yml files
- The configuration files can be referenced inside serverless.yml

# Table of Contents

- [Getting Started](#getting-started)
- [Commands](#commands)

# Getting Started

### 1. Install the plugin

```sh
npm install serverless-config-files --save-dev
```

### 2. Add the plugin to your serverless configuration file

*serverless.yml* configuration example:

```yaml
# Add serverless-config-files to your plugins:
plugins:
  - serverless-config-files

# Plugin config goes into custom:
custom:
  configFile: ~/.serverless/serverless.conf.yml
```

# Commands

You can add simple key/value pairs i.e.
```
sls config-file --set foo:bar
```

Output
```
foo:bar
```

For structured data you can pass it like this:
```
sls config-file --set global.user.name:foo
sls config-file --set global.user.surname:bar
```

Output
```
global:
  user:
    name: foo
    surname: bar
```

