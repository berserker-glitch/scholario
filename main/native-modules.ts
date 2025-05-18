import path from 'path';
import fs from 'fs';
import { app } from 'electron';

/**
 * Helper function to get the correct path for native modules
 * This handles both development and production environments
 */
export function getNativeModulePath(moduleName: string): string {
  const isDev = process.env.NODE_ENV === 'development';
  
  // In development mode, need to use the full path to node_modules
  if (isDev) {
    return path.join(process.cwd(), 'node_modules', moduleName);
  }
  
  // In production, look for the module in the app.asar.unpacked/node_modules
  const appPath = app.getAppPath();
  const isAsar = appPath.includes('app.asar');
  
  if (isAsar) {
    // Replace app.asar with app.asar.unpacked for native modules
    const unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
    return path.join(unpackedPath, 'node_modules', moduleName);
  }
  
  // Fallback to standard node_modules path
  return path.join(process.cwd(), 'node_modules', moduleName);
}

/**
 * Get alternative paths to try for native modules
 */
function getAlternativePaths(moduleName: string): string[] {
  return [
    // Try node_modules in app directory
    path.join(app.getAppPath(), 'node_modules', moduleName),
    // Try node_modules in app parent directory
    path.join(app.getAppPath(), '..', 'node_modules', moduleName),
    // Try node_modules in current working directory
    path.join(process.cwd(), 'node_modules', moduleName),
    // Try absolute path for development
    path.resolve('./node_modules', moduleName),
    // Try electron app resources directory
    path.join(process.resourcesPath || '', 'node_modules', moduleName),
    // Try electron app resources/app directory
    path.join(process.resourcesPath || '', 'app', 'node_modules', moduleName),
    // Try electron app resources/app.asar.unpacked directory
    path.join(process.resourcesPath || '', 'app.asar.unpacked', 'node_modules', moduleName)
  ];
}

/**
 * Check if a module exists at the given path
 */
function moduleExists(modulePath: string): boolean {
  try {
    // Check if the module directory exists
    if (fs.existsSync(modulePath)) {
      return true;
    }
    
    // Check if the module main file exists
    const packageJsonPath = path.join(modulePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const mainFile = packageJson.main || 'index.js';
      const mainPath = path.join(modulePath, mainFile);
      return fs.existsSync(mainPath);
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking if module exists at ${modulePath}:`, error);
    return false;
  }
}

/**
 * Load a native module dynamically
 * @param moduleName - Name of the native module
 */
export function loadNativeModule(moduleName: string): any {
  // Print environment information
  console.log('======== Native Module Loading Diagnostics ========');
  console.log(`Loading native module: ${moduleName}`);
  console.log(`Process cwd: ${process.cwd()}`);
  console.log(`App path: ${app.getAppPath()}`);
  console.log(`User data path: ${app.getPath('userData')}`);
  console.log(`Node.js version: ${process.version}`);
  console.log(`Electron version: ${process.versions.electron}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Arch: ${process.arch}`);
  console.log('=================================================');
  
  const modulePath = getNativeModulePath(moduleName);
  console.log(`Primary module path: ${modulePath}`);
  console.log(`Module exists at primary path: ${moduleExists(modulePath)}`);
  
  try {
    // Try to require the module directly
    console.log(`Attempting to load native module from: ${modulePath}`);
    const module = require(modulePath);
    console.log(`Successfully loaded native module: ${moduleName}`);
    return module;
  } catch (error) {
    console.error(`Failed to load native module ${moduleName} from ${modulePath}:`, error);
    
    // Try alternative paths
    const alternativePaths = getAlternativePaths(moduleName);
    console.log(`Trying ${alternativePaths.length} alternative paths...`);
    
    for (const altPath of alternativePaths) {
      console.log(`Checking alternative path: ${altPath}`);
      console.log(`Module exists at path: ${moduleExists(altPath)}`);
      
      try {
        console.log(`Attempting to load native module from alternative path: ${altPath}`);
        const module = require(altPath);
        console.log(`Successfully loaded native module from alternative path: ${altPath}`);
        return module;
      } catch (altError) {
        console.error(`Failed to load from alternative path ${altPath}:`, altError);
      }
    }
    
    console.error(`CRITICAL ERROR: Could not load native module ${moduleName} from any path`);
    throw new Error(`Could not load native module ${moduleName} from any path`);
  }
} 