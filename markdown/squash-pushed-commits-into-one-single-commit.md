# How to do it?

Just quick commands to get you started, enjoy!

## Soft reset to say 5 commits back (keeps changes staged)

```bash
git reset --soft HEAD~5
```

## Now create a new commit with a new message

```bash
git commit -m "feat(ai-mapping): #1234 - commit message"
```

## Lastly, push your changes

Do not do this on shared branches where other devs are actively pulling your changes as well

```bash
git push --force-with-lease
```
