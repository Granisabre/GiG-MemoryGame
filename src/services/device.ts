class Device {
  // add blacklisting for devices that require settings to be overridden from default
  // S3, iphone4, iphone 6+, Kindle FireHDX etc
  shouldUseAntialias () {
    return false
  }

  deviceResolution () {
    return 1
  }

  shouldForceCanvas () {
    return false
  }

  // helpers - most just to facade UAParser
  isPortrait () {
    return false
  }

  isMobile () {
    return false
  }
}

export default new Device()