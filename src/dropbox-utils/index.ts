import { Dropbox } from 'dropbox';

type DownloadedFile = DropboxTypes.files.FileMetadata & {
  fileBinary?: any;
};

export const getFile = async (
  dbx: Dropbox,
  path: string
): Promise<DownloadedFile | null> => {
  let result: DownloadedFile | null = null;
  try {
    result = await new Promise((resolve, reject) =>
      dbx
        .filesDownload({
          path,
        })
        .then(response => {
          // console.log(response);
          resolve(response);
        })
        .catch((err: DropboxTypes.Error<DropboxTypes.files.UploadError>) => {
          // console.log(err);
          reject(err);
        })
    );
  } catch (e) {
    if (!e.error || e.error.error_summary !== 'path/not_found/.') {
      console.error(e);
      throw e;
    }
    return null;
  }

  return result;
};
