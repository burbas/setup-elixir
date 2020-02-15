const core = require('@actions/core')
const {exec} = require('@actions/exec')
const {installRebar, installOTP} = require('./installer')
const path = require('path')
const semver = require('semver')
const https = require('https')

main().catch(err => {
  core.setFailed(err.message)
})

async function main() {
  checkPlatform()

  const otpSpec = core.getInput('otp-version', {required: true})
  const otpVersion = await getOtpVersion(otpSpec)

  let willInstallRebar = core.getInput('install-rebar')
  willInstallRebar = willInstallRebar == null ? true : willInstallRebar

  console.log(`##[group]Installing OTP ${otpVersion}`)
  await installOTP(otpVersion)
    console.log(`##[endgroup]`)

  process.env.PATH = `/tmp/.otp/erlang/bin:${process.env.PATH}`

  if (willInstallRebar) await installRebar();

}

function checkPlatform() {
}

async function getOtpVersion(spec) {
  return getVersionFromSpec(spec, await getOtpVersions()) || spec
}

function getVersionFromSpec(spec, versions) {
  if (versions.includes(spec)) {
    return spec
  } else {
    const range = semver.validRange(spec)
    return semver.maxSatisfying(versions, range)
  }
}

async function getOtpVersions() {
  const result = await get(
    'https://raw.githubusercontent.com/erlang/otp/master/otp_versions.table'
  )

  return result
    .trim()
    .split('\n')
    .map(line => {
      const [_, version] = line.match(/^OTP-([\.\d]+)/)
      return version
    })
}


function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url)

    req.on('response', res => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        resolve(data)
      })
    })

    req.on('error', err => {
      reject(err)
    })
  })
}
