import fs from 'fs/promises';

export const readFileAsBuffer = (filePath: string): Promise<Buffer> => {
    return fs.readFile(filePath);
};
