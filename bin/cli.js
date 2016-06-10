#!/usr/bin/env node

'use strict';

const expandGlobList = require('../');

expandGlobList(process.argv.slice(2), process.stdout);
