local="http://localhost:8080/ipfs/"
gway="https://ipfs.io/ipfs/"

ifeq ($(DEBUG), true)
	PREPEND=
	APPEND=
else
	PREPEND=@
	APPEND=1>/dev/null
endif

add:
	@ipfs swarm peers >/dev/null 2>&1 || ( \
		echo "error: ipfs daemon must be online to publish"; \
		echo "try running: ipfs daemon" && exit 1)
	ipfs add -rQw --pin=false ./ | tail -n1 >versions/current.txt
	cat versions/current.txt >>versions/history.txt
	@export hash=`cat versions/current.txt`; export hash2=`tail -n2 versions/history.txt | head -n1`; \
		echo ""; \
		echo "published files:"; \
		echo "- $(local)$$hash"; \
		echo "- $(gway)$$hash"; \
		echo ""; \
		echo "shortcuts:"; \
		echo "ipfs pin add $$hash"; \
		echo "ipfs pin rm $$hash2"; \
		echo "ipfs pin update $$hash2 $$hash"; \
		echo "ipfs name publish $$hash"; \

publish:
	@ipfs swarm peers >/dev/null 2>&1 || ( \
		echo "error: ipfs daemon must be online to publish"; \
		echo "try running: ipfs daemon" && exit 1)
	cat versions/current.txt | ipfs pin rm
	ipfs add -rQw ./ | tail -n1 >versions/current.txt
	cat versions/current.txt >>versions/history.txt
	echo "/ipfs/$(cat versions/current.txt)" | ipfs name publish
