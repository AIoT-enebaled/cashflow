#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')

// Start Next.js dev server with cloud-friendly settings
const nextDev = spawn('npx', [
  'next', 
  'dev',
  '--hostname', '0.0.0.0',
  '--port', '3000'
], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    // Disable HMR in cloud environments
    NEXT_PRIVATE_SKIP_MIDDLEWARE_MATCHER: 'true',
    // Optimize for cloud
    NEXT_TELEMETRY_DISABLED: '1'
  }
})

nextDev.on('close', (code) => {
  console.log(`Next.js dev server exited with code ${code}`)
  process.exit(code)
})

nextDev.on('error', (err) => {
  console.error('Failed to start Next.js dev server:', err)
  process.exit(1)
})

// Handle process termination
process.on('SIGINT', () => {
  nextDev.kill('SIGINT')
})

process.on('SIGTERM', () => {
  nextDev.kill('SIGTERM')
})

console.log('Starting Next.js development server for cloud environment...')
