import fs from 'fs';
import path from 'path';

let dir: string | null = null;

export function appInstalledInWindows(appExeName: string) {
  const programFilesPaths = [
    process.env['ProgramFiles'],
    process.env['ProgramFiles(x86)'],
    process.env['LOCALAPPDATA'] // For user-specific installations (e.g., Chrome)
  ];
  
  const isInstalled = programFilesPaths.some((programDir) => {
    if (!programDir) { return false; };
    const exePath = path.join(programDir, appExeName);
    if (fs.existsSync(exePath)) {
      dir = exePath;
      return true;
    }
    return false;
  });

  return {
    isInstalled,
    dir,
  };
}