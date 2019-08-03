/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const md5 = require('md5');
const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');

const getFileId = filePath => md5(filePath).substring(0, 12);

const readFile = (filePath, parentFile) => {
    return fs.lstat(filePath)
        .then(stats => {
            const parsed = path.parse(filePath);
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

const readDir = (dirPath, parentFile) => {
    return fs.readdir(dirPath)
        .then(files => {
            const filePromises = new Array(files.length);
            for (let i = 0; i < files.length; ++i) {
                const filePath = path.join(dirPath, files[i]);
                filePromises[i] = readFile(filePath, parentFile);
            }
            return Promise.all(filePromises);
        });
};

const fileMap = {};

const dirToFsTree = (dirPath, parentFile) => {
    return readDir(dirPath, parentFile)
        .then(files => {
            const promises = [];
            for (const file of files) {
                const skipFile = file.base === 'node_modules'
                    // || file.base === '.git'
                    || file.base === '.idea';
                if (skipFile) continue;

                fileMap[file.id] = file;
                if (parentFile) parentFile.childrenIds.push(file.id);
                if (file.isDir) promises.push(dirToFsTree(path.join(dirPath, file.base), file));
            }
            return Promise.all(promises);
        });
};

let rootFile;
const rootPath = path.join(__dirname, '..');
const outPath = path.join(__dirname, '..', 'demo', 'src', 'chonky_project_fs.json');

readFile(rootPath, null)
    .then(file => {
        fileMap[file.id] = file;
        rootFile = file;
    })
    .then(() => dirToFsTree(rootPath, rootFile))
    .then(() => fs.writeFile(outPath, JSON.stringify({rootFolderId: rootFile.id, fileMap}, null, 2)))
    .catch(console.error);
