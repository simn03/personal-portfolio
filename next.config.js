module.exports = {
  allowedDevOrigins: ["127.0.0.1", "192.168.1.253"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "koito.simrit.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.hardcover.app",
        pathname: "/**",
      },
    ],
  },
}
