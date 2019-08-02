/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import Denque from 'denque';

import {FileData, FileMap, Option, Options, SortOrder, SortProperty} from './typedef';

export class FileUtil {

    static getFolderChain(fileMap: FileMap, folderId: string): FileData[] | null[] {
        let currFolder = fileMap[folderId];

        const folderChain = new Denque();
        while (true) {
            folderChain.unshift(currFolder);
            if (!currFolder) break;

            const parentId = currFolder.parentId;
            if (!parentId) break;
            currFolder = fileMap[parentId];
        }
        return folderChain.toArray();
    }

    static prepareComparator = (foldersFirst: boolean, sortProperty: SortProperty, sortOrder: SortOrder) => {
        return (fileA: FileData, fileB: FileData) => {
            if (foldersFirst) {
                if (fileA.isDir && !fileB.isDir) return -1;
                else if (!fileA.isDir && fileB.isDir) return 1;
            }
            let propA;
            let propB;
            let returnVal = sortOrder === SortOrder.Asc ? 1 : -1;
            if (sortProperty === SortProperty.Size) {
                propA = fileA.size;
                propB = fileB.size;
            } else if (sortProperty === SortProperty.ModDate) {
                propA = fileA.modDate;
                propB = fileB.modDate;
            } else {
                propA = fileA.base;
                propB = fileB.base;
            }
            if (propA > propB) return returnVal;
            else if (propA === propB) return 0;
            else return -returnVal;
        };
    };

    static prepareRawFiles(fileMap: FileMap, folderId?: string, propFileIds?: string[]): [FileData[], string[]] {
        if (folderId && propFileIds) {
            console.warn('[Chonky] Both `folderId` and `fileIds` were specified as props for FileBrowser. ' +
                'Using `fileIds`.');
        }

        let folder;
        let fileIds = null;
        if (propFileIds) {
            fileIds = propFileIds;
        } else if (folderId) {
            folder = fileMap[folderId];
            fileIds = folder.childrenIds;
        } else {
            throw new Error('[Chonky] Neither `folderId` nor `fileIds` were specified as props for FileBrowser.');
        }

        const rawFilesQueue = new Denque();
        const missingIdsQueue = new Denque();
        for (let i = 0; i < fileIds.length; ++i) {
            const id = fileIds[i];
            const file = fileMap[id];
            if (file) rawFilesQueue.push(file);
            else missingIdsQueue.push(id);
        }
        return [rawFilesQueue.toArray(), missingIdsQueue.toArray()];
    }

    static sortFiles(rawFiles: FileData[], options: Options,
                     sortProperty: SortProperty, sortOrder: SortOrder): FileData[] {
        let files = rawFiles.slice(0);
        if (!options[Option.ShowHidden]) files = files.filter(f => f.name.charAt(0) !== '.');
        const comparator = FileUtil.prepareComparator(options[Option.FoldersFirst], sortProperty, sortOrder);
        files.sort(comparator);
        return files;
    }

}
