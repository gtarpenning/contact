import random
import weave
import asyncio
import openai

weave.init('contact-dev-prompts')


dataset = []

# list of 11 random words:
words = [
    'guacamole',
    'despair',
    'purple',
    'jellybean',
    'onomonopeia',
    'kumquat',
    'worm',
    'marxism',
    'sailing',
    'apple',
    'banana',
]

for i in range(100):
    examples = random.sample(words, 3)
    prompt_base = f"""Generate a random word, here are some examples:
    {examples}
    ONLY respond with the exact word, nothing else.
    """
    dataset.append({'prompt': prompt_base})


@weave.op()
def predict(prompt):
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content

common = [
    "quasar",
    "serendipity",
    "quokka",
    "lollipop"
]

@weave.op()
def scoring_fn(output):
    return {
        "included": output in words,
        "common": output in common,
    }


evaluation = weave.Evaluation(
    dataset=dataset ,
    scorers=[
        scoring_fn
    ],
)

print(asyncio.run(evaluation.evaluate(predict)))
