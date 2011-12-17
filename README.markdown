The repository for the [DOM](http://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html).

For make details see [setting up Anolis with cross-specification cross-references](http://wiki.whatwg.org/wiki/Anolis).

When pushing commits, make sure you update both dvcs.w3.org and bitbucket.
For instance, edit .hg/hgrc to contain something like

  [paths]
  default = https://dvcs.w3.org/hg/domcore
  bitbucket = ssh://hg@bitbucket.org/ms2ger/dom-core

and then do

  $ hg push; hg push bitbucket

Obviously, you need to be authorized to push to both locations.
