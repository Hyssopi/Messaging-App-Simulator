/* eslint-disable no-undef, @typescript-eslint/explicit-function-return-type */
(async () => {
  // 1. Add Contact(s)
  const TutorialGuide = contact('Tutorial', 'Guide', 'chapters/tutorial/images/tutorial-guide.png');

  // 2. (Optional) Wait for specific conditions (such as flags, etc), or when the player enters into this person's chat
  //await waitFor(() => hasFlag('test-flag'));
  await waitFor(() => activeContactName() === TutorialGuide);

  // 3. Set the clock
  //setClock(2025, 9, 1, 17, 0);

  // 4. (Optional) Add timestamp in chat
  timestamp(TutorialGuide);

  // 5. Start the chapter

  await textLeft(`Welcome!`, TutorialGuide);
  await textLeft(`I'm here to explain how to play... as quickly as possible!`, TutorialGuide);
  await textLeft(
    `To continue, you can:
• Click on the 'Send' button
• Press 'Enter' on the keyboard
• Press 'Space bar' on the keyboard`,
    TutorialGuide,
  );

  await textRight(`How can I fast forward?`, TutorialGuide);
  await reaction('👍', TutorialGuide, 1);
  await textLeft(
    `Hold down 'Ctrl' on the keyboard to temporarily fast forward. Release the key to stop.`,
    TutorialGuide,
  );

  await textRight(`How can I view images?`, TutorialGuide);
  await textLeft(`Here is an example of an image:`, TutorialGuide);
  await mediaLeft('chapters/debug/images/Cat.png', TutorialGuide, NORMAL);
  await textLeft(
    `Click on the image to get a better look at it.
Then click anywhere or press the 'Esc' key to exit.`,
    TutorialGuide,
  );

  await textRight(`How can I play videos?`, TutorialGuide);
  await textLeft(`Here is an example of a video:`, TutorialGuide);
  await mediaLeft('chapters/debug/videos/mov_bbb.mp4', TutorialGuide, NORMAL);
  await textLeft(
    `Click on the video to play it.
Then press the 'Esc' key to exit.`,
    TutorialGuide,
  );

  await textRight(`Are there branching paths?`, TutorialGuide);
  await textLeft(`Yes. The author can ask the player to make a decision.`, TutorialGuide);
  await textLeft(`For example: which do you like more? Pizza or burger?`, TutorialGuide);
  await textLeft(
    `The text input will turn yellow and you can choose between the choices using:
• Up/down arrow keys on the keyboard
• Mouse scroll wheel up/down`,
    TutorialGuide,
  );
  await choices(
    [
      {
        displayText: `Pizza.`,
        fullText: `Pizza! It's delicious.`,
        callback: () => {
          addFlag('pizza');
        },
      },
      {
        displayText: `Burger.`,
        fullText: `Burger! You can't go wrong with burgers.`,
        callback: () => {
          addFlag('burger');
        },
      },
    ],
    TutorialGuide,
  );
  if (hasFlag('pizza')) {
    await reaction('🍕', TutorialGuide);
    await textLeft(`I love mine with extra pepperoni!`, TutorialGuide);
  } else if (hasFlag('burger')) {
    await reaction('🍔', TutorialGuide);
    await textLeft(`That's right, I've never had a bad burger before!`, TutorialGuide);
  }

  await textRight(`How can I find the in-game time?`, TutorialGuide);
  await textLeft(`Look for a timestamp like this:`, TutorialGuide);
  timestamp(TutorialGuide);
  await textLeft(`Hover your mouse on top of it to get the exact time at that moment.`, TutorialGuide);

  await textRight(`Can I save or load the game?`, TutorialGuide);
  await textLeft(`No, saving and loading are currently not supported.`, TutorialGuide);

  await textRight(`I understand. Thanks for explaining.`, TutorialGuide);
  await reaction('👍', TutorialGuide);
  await textLeft(`Great! No problem!`, TutorialGuide);
  await textLeft(
    `By the way: you can change the settings by going back to the main screen and clicking on 'Edit'.`,
    TutorialGuide,
  );
})();
