
import random
from llm import handle_msg
import weave
from util import WEAVE_PROJECT_NAME

weave.init(WEAVE_PROJECT_NAME)


START_WORDS = ["wind"] #  ["spinach", "geode"]


@weave.op
def get_user_word(prompt: str):
    return input(prompt).strip()


@weave.op
def play_game():
    print("Welcome to the Contact game!")
    
    # Choose the hidden first word.
    llm_word = random.choice(START_WORDS)

    # Prompt the user to enter their word (without revealing the first word yet).
    user_word = get_user_word("Enter your word: ")
    if not user_word:
        print("No word entered. Exiting.")
        return
    
    history = []
    while True:
        print(f"Find the midpoint:  {user_word} and **{llm_word}**")

        last_two_turns = history[-4:]

        try:
            # Compute midpoint between user_word and first_word.
            llm_word = handle_msg(user_word, llm_word, last_two_turns)
        except Exception as e:
            print(f"Error computing midpoint: {e}")
            return

        # Prompt the user for their midpoint guess. The LLM's computed guess is shown immediately after.
        user_word = get_user_word("> ")
        if not user_word:
            print("No word entered. Exiting.")
            return
        
        if user_word == llm_word:
            print("  *** CONTACT ***")
            print(" You just made contact with alien intelligence!")
            break

        history += [user_word, llm_word]

def main():
    play_game()

if __name__ == "__main__":
    main()
