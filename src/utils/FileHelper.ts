import { FileInputPreviewType } from "../form/FileInput";
import { BoolHelper } from "./BoolHelper";

export const FileHelper = {

    fileListToFileArray(fileList: FileList | null) {
        const files: File[] = [];
        if (!fileList) return files;
        for (let index = 0; index < fileList.length; index++) {
            files.push(fileList.item(index)!);
        }
        return files;
    },

    // https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404
    humanFileSize(bytes: number, si = false, dp = 1) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }

        const units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        let u = -1;
        const r = 10 ** dp;

        do {
            bytes /= thresh;
            ++u;
        } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


        return bytes.toFixed(dp) + ' ' + units[u];
    },

    fileToText: async (file: File) => {
        return await file.text();
    },

    fileToBase64: (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64data = reader.result as string;
                if (!base64data) {
                    reject(new Error("Failed to convert File to Base64"));
                    return;
                }
                resolve(base64data!.substring(base64data!.indexOf(',') + 1));
            };
        });
    },

    detectPreviewTypeFromUrl: (url: string) => {
        if (BoolHelper.anyEquals((e) => url.includes(e.toLowerCase()), ".pdf")) {
            return FileInputPreviewType.PDF;
        } else if (BoolHelper.anyEquals((e) => url.includes(e.toLowerCase()), ".mp3", ".wav")) {
            return FileInputPreviewType.AUDIO;
        } else if (BoolHelper.anyEquals((e) => url.includes(e.toLowerCase()), ".html", ".text")) {
            return FileInputPreviewType.HTML;
        } else if (BoolHelper.anyEquals((e) => url.includes(e.toLowerCase()), ".mp4", ".mpeg", ".mov")) {
            return FileInputPreviewType.VIDEO;
        } else if (BoolHelper.anyEquals((e) => url.includes(e.toLowerCase()), ".png", ".jpg", ".gif", ".jpeg", ".webp")) {
            return FileInputPreviewType.IMAGE;
        }
        return FileInputPreviewType.AUTO;
    },

}
