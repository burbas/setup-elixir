const {exec} = require('@actions/exec')
const path = require('path')
const semver = require('semver')

module.exports = {installRebar, installOTP}

/**
 * Install rebar3.
 *
 */
async function installRebar() {
  if (process.platform === 'linux' || process.platform === 'darwin') {
    await exec(path.join(__dirname, 'install-rebar'), [])
  }
}

/**
 * Install OTP.
 *
 * @param {string} version
 */
async function installOTP(version) {
  if (process.platform === 'linux' || process.platform === 'darwin') {
    await exec(path.join(__dirname, 'install-otp'), [version])
    return
  }

  throw new Error(
    '@actions/setup-erlang only supports Ubuntu Linux and MacOS at this time'
  )
}
