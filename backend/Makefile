PYTHON := python3.11
PIP := $(PYTHON) -m pip
POETRY := $(PYTHON) -m poetry

pre-install:
	$(PIP) install poetry

install: pre-install
	$(POETRY) install

lock: pre-install
	$(POETRY) lock

lint:
	ruff check .

fix:
	ruff check . --fix