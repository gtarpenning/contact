import litellm
import weave
from util import WEAVE_PROJECT_NAME


weave.init(WEAVE_PROJECT_NAME)

SYSTEM_PROMPT_INITIAL = """
generate a *random* word, examples: 
- guacamole
- despair
- purple
- jellybean

ONLY respond with the exact word, nothing else.
"""

SYSTEM_PROMPT_S = """
Find the semantic/logical midpoint between the two words. 
Only respond with the word, nothing else.
When possible, respond with the most common word.
Example:
  word1: sailing, word2: sailboat
  response: sail

You cannot use previous words! Prohibited words will be provided.
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


@weave.op
def get_initial_word():
    """
    Generate an initial random word
    
    Returns:
        A random word from the LLM
    """
    model = litellm.completion(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_INITIAL}
        ],
        max_completion_tokens=20,
    )
    try:
        return model["choices"][0]["message"]["content"].lower()
    except Exception as e:
        print(f"Error: {e}")
        raise ValueError(f"Error: {e}")

