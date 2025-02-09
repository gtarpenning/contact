start:
	uvicorn main:app --reload

fe:
	cd contact-app && bunx --bun vite