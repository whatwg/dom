The repository for the [DOM](http://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html).

For make details see [setting up Anolis with cross-specification cross-references](http://wiki.whatwg.org/wiki/Anolis).

When pushing commits, make sure you update both Bitbucket and dvcs.w3.org.
For instance, edit .hg/hgrc to contain something like

  [paths]
  default = ssh://hg@bitbucket.org/ms2ger/dom-core
  w3c = https://dvcs.w3.org/hg/domcore

and then do

  $ hg push; hg push w3c

Obviously, you need to be authorized to push to both locations.
