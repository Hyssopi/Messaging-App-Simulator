/* eslint-disable no-undef, @typescript-eslint/explicit-function-return-type */
(async () => {
  // 1. Add Contact(s)
  const TemplateStarter = contact('Template', 'Starter', 'chapters/template/images/sample.png');

  // 2. (Optional) Wait for specific conditions (such as flags, etc), or when the player enters into this person's chat
  //await waitFor(() => hasFlag('test-flag'));
  await waitFor(() => activeContactName() === TemplateStarter);

  // 3. Set the clock
  //setClock(2025, 9, 1, 17, 0);

  // 4. (Optional) Add timestamp in chat
  timestamp(TemplateStarter);

  // 5. Start the chapter

  await textLeft(`Hello! You can start adding stuff here.`, TemplateStarter);
})();
