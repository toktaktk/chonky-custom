/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2019
 * @license MIT
 */

import {FileData, Nullable, Option, Options, SortOrder, SortProperty} from './typedef';

export class FileUtil {

    static prepareComparator = (foldersFirst: boolean, sortProperty: SortProperty, sortOrder: SortOrder) => {
        return (fileA: Nullable<FileData>, fileB: Nullable<FileData>) => {
            // If file is `null` (i.e. is loading) show it last
            if (!fileA) return 1;
            if (!fileB) return -1;

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
            if (propA === undefined || propA === null) return -returnVal;
            else if (propB === undefined || propB === null) return returnVal;
            else if (propA > propB) return returnVal;
            else if (propA === propB) return 0;
            else return -returnVal;
        };
    };

    static sortFiles(rawFiles: Nullable<FileData>[], options: Options,
                     sortProperty: SortProperty, sortOrder: SortOrder): Nullable<FileData>[] {
        let files = rawFiles.slice(0);
        if (!options[Option.ShowHidden]) {
            files = files.filter(f => f === null || f.name.charAt(0) !== '.');
        }
        const comparator = FileUtil.prepareComparator(options[Option.FoldersFirst], sortProperty, sortOrder);
        files.sort(comparator);
        return files;
    }

}
