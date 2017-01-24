local: dom.bs
	bikeshed spec dom.bs dom.html --md-Text-Macro="SNAPSHOT-LINK LOCAL COPY"

remote: dom.bs
	curl https://api.csswg.org/bikeshed/ -f -F file=@dom.bs > dom.html -F md-Text-Macro="SNAPSHOT-LINK LOCAL COPY"

deploy: url.bs
	curl --remote-name --fail https://resources.whatwg.org/build/deploy.sh && bash ./deploy.sh
