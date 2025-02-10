import litellm
import weave
from util import WEAVE_PROJECT_NAME


weave.init(WEAVE_PROJECT_NAME)

SYSTEM_PROMPT_N = """
We are playing a game where we both say a word at the same time. 
Then we both have to think of the word that is the MIDPOINT between the two words, 
the goal is to reach the same word, then be both win!
Please only respond with the word you think is in between the two words.
"""

SYSTEM_PROMPT_S = """
Find the semantic/logical midpoint between the two words. 
Only respond with the word, nothing else.
Don't use previous words.
"""


@weave.op
def handle_msg(msg: str, prev_msg: str, history: list[str]):
    """
    Pass msg to the LLM and return the response

    Args:
        msg: The word to send to the LLM
        prev_msg: previous word

    Returns:
        The response from the LLM
    """
    user_prompt = f"previous: {history}, word1: {prev_msg}, word2: {msg}"
    model = litellm.completion(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_S},
            {"role": "user", "content": user_prompt},
        ],
        max_completion_tokens=20,
    )
    try:
        return model["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error: {e}")
        raise ValueError(f"Error: {e}")

