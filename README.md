# Aspen

Aspen is a collection (well, just one for now) of serverless functions to make digital note-taking better. It assumes you keep notes as plaintext in a single folder in Dropbox. That's a lot of assumptions, and I doubt many people will want to use Aspen. Only use it if you, like me, keep notes in a single folder in Dropbox.

## What can it do?

Right now, it can:

- Have a daily journal note waiting for you, based on a template note you write yourself. If you keep daily todos (in the `- [ ]` format) in that note, incomplete todos from the day before will be added to the new day's todo list.

There are other functions I want to add. Some of the ones I for-sure know I want are below, and other ideas may be in GitHub issues.

- Intuit connections between notes on some regular cadence.
- Create an on-demand archival verion of your notes folder (a subset based on search or tags or date range?), email you that archive, and ship a bound print copy of that archive to your front door.

## Why Serverless? Why on AWS?

Serverless because [postlight/serverless-babel-starter](https://github.com/postlight/serverless-babel-starter/) made it super easy. AWS because that is that template's default, although I plan on switching to a cloud provider that isn't as obviously evil as Amazon soon.

## Using it

```
git clone git@github.com:kevboh/aspen.git
cd aspen/
yarn install

# Add your env vars
cp .env.example .env
vim .env

# If you want to, edit serverless.yml to customize deploys and invocation cadence.

# Deploy it
yarn deploy:production
```

Before invoking the journal function, add a note at `NOTES_PATH/JOURNAL_TEMPLATE_FILE` that looks however you want your daily journal to start out as. If it includes a `{{todos}}` string, that token will be replaced by incomplete todo items from the day before. Mine looks something like this:

```markdown
# Day

# Do

{{todos}}

#journal
```

## Why...

### ...plaintext?

Because while nothing digital is permanent—your notes are only as legible as the world's electric grid—plaintext is the closest thing we have to a forever format. It is portable, readable, and not proprietary.

### ...in a single folder?

Because organization is largely a farcical game we play with ourselves to stave off mortality. That being said, future functions may attempt to wrangle a _bit_ of organization out of your notes. I like a single folder because life is a big slurry of ideas, none of which are entirely separate from each other.

### ...in Dropbox?

Because Dropbox has an API, and because I mostly use iOS and macOS and don't want to put all my sync eggs in one (inscrutable) basket.
