import { Dropbox } from 'dropbox';
import { getFile } from '../dropbox-utils';

const NOTES_PATH = process.env.NOTES_PATH;

export class Note {
  static async fromDropbox(dbx: Dropbox, name: string): Promise<Note | null> {
    const path = `${NOTES_PATH}${name}`;
    console.log(`[ASPEN] Attempting to load file at ${path}`);
    const file = await getFile(dbx, path);

    if (!file || !file.fileBinary) {
      console.log(`[ASPEN] No file to load at ${path}.`);
      return null;
    }

    return new Note(Buffer.from(file.fileBinary, 'utf-8'));
  }

  static fromTemplate(template: Note, previousDay: Note | null = null): Note {
    let todoContents = `- [ ] `;
    if (previousDay) {
      const incompleteTodos = previousDay.remainingTodos();
      if (incompleteTodos) {
        todoContents = '';
        incompleteTodos.forEach(todo => {
          todoContents += `${todo}\n`;
        });
      }
    }

    const templateContents = template.contents.toString();
    const newNoteContents = templateContents.replace('{{todos}}', todoContents);
    return new Note(Buffer.from(newNoteContents, 'utf-8'));
  }

  private contents: Buffer;
  constructor(contents: Buffer) {
    this.contents = contents;
  }

  remainingTodos(): string[] | null {
    const contentString = this.contents.toString();
    const incompleteTodos = contentString.match(/(- \[ ] .*)$/gm);
    return incompleteTodos;
  }

  async saveTo(
    dbx: Dropbox,
    name: string
  ): Promise<DropboxTypes.files.FileMetadata> {
    const path = `${NOTES_PATH}${name}`;
    return dbx.filesUpload({ path, contents: this.contents.toString() });
  }
}
