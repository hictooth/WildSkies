'use strict'

// used to get the root directory of this app
//
// we can't use __dirname in all files due to nwjs weirdness
// so therefore we have this file export it for us!

module.exports = {
    rootdir: __dirname
}
