SHELL=/bin/bash -o pipefail
.PHONY: local remote deploy review

remote: dom.bs
	curl https://api.csswg.org/bikeshed/ -f -F file=@dom.bs > dom.html -F md-Text-Macro="SNAPSHOT-LINK LOCAL COPY"

local: dom.bs
	bikeshed spec dom.bs dom.html --md-Text-Macro="SNAPSHOT-LINK LOCAL COPY"

deploy: dom.bs
	curl --remote-name --fail https://resources.whatwg.org/build/deploy.sh
	bash ./deploy.sh

review: dom.bs
	curl --remote-name --fail https://resources.whatwg.org/build/review.sh
	bash ./review.sh
