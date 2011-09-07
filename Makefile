ANOLIS = anolis

all: Overview.html dom-core.html data/xrefs/dom/dom.json

Overview.html: Overview.src.html data Makefile
	$(ANOLIS) --output-encoding=ascii --omit-optional-tags --quote-attr-values \
	--w3c-compat --enable=xspecxref --enable=refs --w3c-shortname="dom" \
	--filter=".publish, .now3c" $< $@

data/xrefs/dom/dom.json: Overview.src.html Makefile
	$(ANOLIS) --dump-xrefs=$@ $< /tmp/spec

publish: Overview.src.html data Makefile
	$(ANOLIS) --output-encoding=ascii --omit-optional-tags --quote-attr-values \
	--w3c-compat --enable=xspecxref --enable=refs --w3c-shortname="dom" \
	--filter=".dontpublish, .now3c" --pubdate="$(PUBDATE)" --w3c-status=WD \
	$< Overview.html

dom-core.html: Overview.src.html data Makefile
	$(ANOLIS) --output-encoding=ascii --omit-optional-tags --quote-attr-values \
	--w3c-compat-xref-a-placement --enable=xspecxref --enable=refs \
	--filter=".publish, .w3conly, title + style" $< $@
