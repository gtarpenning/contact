"""
Main fastapi entrypoint for our LLM application
"""

from fastapi import FastAPI
from llm import handle_msg
import weave
from util import WEAVE_PROJECT_NAME

weave.init(WEAVE_PROJECT_NAME)


MAX_MSG_LEN = 20


app = FastAPI()


@app.get("/")
async def root():
    return {"alive": True}

@weave.op
@app.post("/msg")
async def next(msg: str, prev_msg: str):
    """
    Main endpoint to send word(s) to the LLM

    Args:
        msg: The word to send to the LLM
        history: previous words

    Returns:
        The response from the LLM
    """
    if not isinstance(msg, str):
        raise ValueError("msg must be a string")
    if len(msg) == 0:
        raise ValueError("msg must not be empty")
    if len(msg) > MAX_MSG_LEN or len(prev_msg) > MAX_MSG_LEN:
        raise ValueError(f"msgs must be less than {MAX_MSG_LEN} characters")
    return handle_msg(msg, prev_msg)
