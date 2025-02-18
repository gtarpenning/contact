/* File to handle LLM calls */

/**
 * Pass msg to the LLM and return the response.
 *
 * @param msg - The word to send to the LLM.
 * @param prevMsg - The previous word.
 * @returns The response from the LLM.
 */
export const handleMsg = async (
  msg: string,
  prevMsg: string
): Promise<string> => {
    return Promise.resolve('hello');
  try {
    const response = await fetch(`/api/msg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ msg, prevMsg }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getInitialWord = async (): Promise<string> => {
  return Promise.resolve('hello');
  try {
    const response = await fetch(`/api/random`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
