
# DOM Standard

This is the repository in which the W3C snapshot version of the DOM Standard is maintained.

If you wish to file issues or provide pull requests against the standard rather than the snapshots
or the tools that produce them, we recommend you do so against the
[upstream repository](https://github.com/whatwg/dom).

## How this works

The `master` branch tracks the upstream repository, no local changes are made to it. The `gh-pages`
branch contains merges from `master`, tools to produce the snapshot, and the snapshot itself as
`index.html`.

Where needed, feature branches are used in order to make pull requests against the upstream 
repository.
