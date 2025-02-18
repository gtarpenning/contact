start:
	uvicorn main:app --reload

fe:
	cd contact-app && bunx --bun vite

prettier:
	cd contact-app && bunx --bun prettier --write .
