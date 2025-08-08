/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer, webpack }) => {
    if (dev && !isServer) {
      // Enhanced cloud environment configuration
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }

      // Detect cloud environment (Fly.dev, Vercel, etc.)
      const isCloudEnv = process.env.FLY_APP_NAME || 
                        process.env.VERCEL || 
                        process.env.RAILWAY_PROJECT_ID ||
                        process.env.RENDER ||
                        process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_DEV_LOCAL

      if (isCloudEnv) {
        // Disable problematic HMR features in cloud environments
        config.plugins = config.plugins.filter(plugin => {
          // Remove ReactRefreshWebpackPlugin that causes fetch issues in cloud
          return !plugin.constructor.name.includes('ReactRefreshWebpackPlugin')
        })

        // Add custom webpack plugin to handle HMR gracefully
        config.plugins.push(
          new webpack.DefinePlugin({
            'process.env.__NEXT_HMR_FALLBACK': JSON.stringify('true'),
            'process.env.__NEXT_CLOUD_ENV': JSON.stringify('true'),
          })
        )

        // Configure HMR to be more resilient
        if (config.entry && typeof config.entry === 'object') {
          Object.keys(config.entry).forEach(key => {
            if (Array.isArray(config.entry[key])) {
              // Filter out problematic HMR entries that cause fetch errors
              config.entry[key] = config.entry[key].filter(entry => 
                !entry.includes('webpack-hot-middleware') &&
                !entry.includes('react-refresh')
              )
            }
          })
        }
      }

      // Enhanced error handling for HMR
      const originalOptimization = config.optimization || {}
      config.optimization = {
        ...originalOptimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: {
          ...originalOptimization.splitChunks,
          cacheGroups: {
            ...originalOptimization.splitChunks?.cacheGroups,
            // Separate HMR-related chunks to isolate errors
            hmr: {
              name: 'hmr',
              chunks: 'all',
              test: /[\\/]node_modules[\\/].*hot.*[\\/]/,
              priority: 30,
              reuseExistingChunk: true,
            }
          }
        }
      }
    }

    return config
  },

  // Enhanced experimental features for cloud stability
  experimental: {
    optimizePackageImports: ['@prisma/client'],
    // Disable problematic features in cloud environments
    ...(process.env.FLY_APP_NAME && {
      webVitalsAttribution: ['CLS', 'LCP'],
      optimizeCss: false, // Can cause issues in cloud builds
    })
  },

  // Production optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Enhanced headers for cloud environments
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Help with HMR in cloud environments
          ...(process.env.NODE_ENV === 'development' ? [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            }
          ] : [])
        ],
      },
    ]
  }
}

module.exports = nextConfig
