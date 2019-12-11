import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-fetch';
import { format, subDays } from 'date-fns';

import { successResponse } from '../../utils';
import * as Aspen from '../../lib/aspen';

const { DROPBOX_ACCESS_TOKEN, JOURNAL_TEMPLATE_FILE } = process.env;

const journal: Function = async (event: AWSLambda.APIGatewayEvent) => {
  if (!DROPBOX_ACCESS_TOKEN || !JOURNAL_TEMPLATE_FILE) {
    throw new Error('[ASPEN][JOURNAL] Missing required env var.');
  }

  // Init Dropbox
  const dbx = new Dropbox({
    accessToken: DROPBOX_ACCESS_TOKEN,
    fetch,
  });

  // Get today and yesterday note titles
  const now = new Date();
  const formatTitle = (date: Date): string =>
    `${format(date, 'M-d-yyyy (EEEE)')} Journal.txt`;
  const title = formatTitle(now);
  const yesterdayTitle = formatTitle(subDays(now, 1));

  // Get the previous day and the journal template
  const previousDay = await Aspen.Note.fromDropbox(dbx, yesterdayTitle);
  const template = await Aspen.Note.fromDropbox(dbx, JOURNAL_TEMPLATE_FILE);

  if (!template) {
    throw new Error('[ASPEN][JOURNAL] Template note not found.');
  }

  // Generate and save today's journal note
  const today = Aspen.Note.fromTemplate(template, previousDay);
  const createdFile = await today.saveTo(dbx, title).catch(err => {
    throw err;
  });

  return successResponse({
    message: `Created ${createdFile.path_display}`,
    input: event,
  });
};

export default journal;
