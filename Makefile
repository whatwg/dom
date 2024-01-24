SHELL=/bin/bash -o pipefail
.PHONY: local remote deploy

remote: dom.bs
	@ (HTTP_STATUS=$$(curl https://api.csswg.org/bikeshed/ \
	                       --output dom.html \
	                       --write-out "%{http_code}" \
	                       --header "Accept: text/plain, text/html" \
	                       -F die-on=warning \
	                       -F md-Text-Macro="COMMIT-SHA LOCAL COPY" \
	                       -F file=@dom.bs) && \
	[[ "$$HTTP_STATUS" -eq "200" ]]) || ( \
		echo ""; cat dom.html; echo ""; \
		rm -f dom.html; \
		exit 22 \
	);

local: dom.bs
	bikeshed spec dom.bs dom.html --md-Text-Macro="COMMIT-SHA LOCAL-COPY"

deploy: dom.bs
	curl --remote-name --fail https://resources.whatwg.org/build/deploy.sh
	bash ./deploy.sh
