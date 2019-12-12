remote: dom.bs
	curl https://api.csswg.org/bikeshed/ -f -F file=@dom.bs > dom.html -F md-Text-Macro="SNAPSHOT-LINK LOCAL COPY"

local: dom.bs
	bikeshed spec dom.bs dom.html --md-Text-Macro="SNAPSHOT-LINK LOCAL COPY"

deploy: dom.bs
	curl --remote-name --fail https://raw.githubusercontent.com/whatwg/whatwg.org/sideshowbarker/deploy.sh-w3c-additions/resources.whatwg.org/build/deploy.sh
	POST_BUILD_STEP="python w3c-status-insert-into-review-drafts.py" bash ./deploy.sh

review: dom.bs
	curl --remote-name --fail https://raw.githubusercontent.com/whatwg/whatwg.org/sideshowbarker/deploy.sh-w3c-additions/resources.whatwg.org/build/review.sh
	bash ./review.sh
