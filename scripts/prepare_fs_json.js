/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

const md5 = require('md5');
const path = require('path');
const fs = require('fs-extra');
const Promise = require('bluebird');
const ThumbnailGenerator = require('fs-thumbnail');

const getFileId = filePath => md5(filePath).substring(0, 12);

const thumbDirPath = path.resolve(__dirname, '..', 'demo', 'public', 'thumbnails');
const thumbGen = new ThumbnailGenerator({verbose: false, size: 300, quality: 60});

const readFile = (filePath, parentFile) => {
    const id = getFileId(filePath);
    const parsed = path.parse(filePath);
    let hasThumbnail = false;
    return Promise.resolve()
        .then(() => thumbGen.getThumbnail({
            path: filePath,
            output: path.join(thumbDirPath, `${parsed.name}.jpg`),
        }))
        .then(thumbnailPath => {
            if (thumbnailPath) hasThumbnail = true;
        })
        .then(() => fs.lstat(filePath))
        .then(stats => {
            return {
                id,

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

                // Custom fields, not required/supported by Chonky
                hasThumbnail,
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

const prepareFsJson = (rootPath, outPath) => {
    let rootFile;
    readFile(rootPath, null)
        .then(file => {
            fileMap[file.id] = file;
            rootFile = file;
        })
        .then(() => dirToFsTree(rootPath, rootFile))
        .then(() => fs.writeFile(outPath, JSON.stringify({rootFolderId: rootFile.id, fileMap}, null, 2)))
        .catch(console.error);
};

prepareFsJson(path.resolve(__dirname, '..'),
    path.resolve(__dirname, '..', 'demo', 'src', 'fs_chonky_project.json'));
prepareFsJson(path.resolve(__dirname, '..', '..', '..', 'misc', 'Images with thumbnails'),
    path.resolve(__dirname, '..', 'demo', 'src', 'fs_japan_pics.json'));
