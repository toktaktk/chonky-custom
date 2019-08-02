/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const md5 = require('md5');
const path = require('path');
const fs = require('fs-extra');
const upath = require('upath');
const Promise = require('bluebird');

const getFileId = filePath => md5(filePath).substring(0, 12);

const readFile = (filePath, parentFile) => {
    return fs.lstat(filePath)
        .then(stats => {
            const parsed = upath.parse(filePath);
            return {
                id: getFileId(filePath),

                base: parsed.base,
                name: parsed.name,
                ext: parsed.ext,

                size: stats.isDirectory() ? null : stats.size,
                modDate: stats.ctime,

                isDir: stats.isDirectory(),
                isHidden: parsed.name.charAt(0) === '.',
                isSymlink: stats.isSymbolicLink(),

                parentId: parentFile ? parentFile.id : null,
                childrenIds: [],
            };
        });
};

const readDir = (basePath, dirPath, parentFile) => {
    const fullPath = upath.join(basePath, dirPath);
    return fs.readdir(fullPath)
        .then(files => {
            const filePromises = new Array(files.length);
            for (let i = 0; i < files.length; ++i) {
                const filePath = upath.join(fullPath, files[i]);
                filePromises[i] = readFile(filePath, parentFile);
            }
            return Promise.all(filePromises);
        });
};

const fileMap = {};
const rootPath = '/home/euql1n/Workspaces/Personal';

const dirToFsTree = (dirPath, parentFile) => {
    return readDir(rootPath, dirPath, parentFile)
        .then(files => {
            const promises = [];
            for (const file of files) {
                if (file.base === 'node_modules' || file.base === '.git' || file.base === '.idea') continue;

                fileMap[file.id] = file;
                if (parentFile) parentFile.childrenIds.push(file.id);
                if (file.isDir) promises.push(dirToFsTree(upath.join(dirPath, file.base), file));
            }
            return Promise.all(promises);
        });
};

const outPath = path.join(__dirname, '..', 'demo', 'src', 'project-fs.json');
let rootFile;
readFile(path.join(rootPath, 'Chonky'), null)
    .then(file => {
        fileMap[file.id] = file;
        rootFile = file;
    })
    .then(() => dirToFsTree('Chonky', rootFile))
    .then(() => fs.writeFile(outPath, JSON.stringify({root: rootFile.id, fileMap})))
    .catch(console.error);
