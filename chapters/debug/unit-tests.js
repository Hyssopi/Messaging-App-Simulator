/* eslint-disable no-undef, @typescript-eslint/explicit-function-return-type */
(async () => {
  // 1. Add Contact(s)
  const JaneDoe = contact('Jane', 'Doe', 'chapters/debug/images/sample-contact-01.png');
  const SarahSmith = contact('Sarah', 'Smith', 'chapters/debug/images/sample-contact-02.png');

  // 2. (Optional) Wait for specific conditions (such as flags, etc), or when the player enters into this person's chat
  //await waitFor(() => hasFlag('test-flag'));
  await waitFor(() => activeContactName() === JaneDoe);

  // 3. Set the clock
  //setClock(2025, 9, 1, 17, 0);

  // 4. (Optional) Add timestamp in chat
  timestamp(JaneDoe);

  // 5. Start the chapter

  const enableSleepTest = true;
  const enableWaitForTest = true;
  const enableMessageSpeedTest = true;
  const enableClockTest = true;
  const enableBatteryTest = true;
  const enableContactTest = true;
  const enableRenameTest = true;
  const enableActiveContactNameTest = true;
  const enableReceivedTextTest = true;
  const enableReceivedMediaTest = true;
  const enableSentTextTest = true;
  const enableSentMediaTest = true;
  const enableReactionTest = true;
  const enableChoiceTest = true;
  const enableFlagTest = true;
  const enableNotificationTest = true;

  if (enableSleepTest) {
    await textLeft(`=====[START] Sleep=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Sleep for 5 seconds...`, JaneDoe, INSTANT);
    await sleep(5000);
    await textLeft(`TEST: Sleep for 2 seconds...`, JaneDoe, INSTANT);
    await sleep(2000);
    await textLeft(`TEST: Sleep for 0 seconds...`, JaneDoe, INSTANT);
    await sleep(0);
    await textLeft(`TEST: Sleep for negative seconds...`, JaneDoe, INSTANT);
    await sleep(-1000);

    await textRight(`=====[END] Sleep=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Sleep=====`, JaneDoe, INSTANT);
  }

  if (enableWaitForTest) {
    await textLeft(`=====[START] Wait For=====`, JaneDoe, INSTANT);

    await textLeft(`Adding 'Debug_Test_A' flag after 5 second delay...`, JaneDoe, INSTANT);
    setTimeout(() => {
      addFlag('Debug_Test_A');
    }, 5000);
    await textLeft(`TEST: Wait for 'Debug_Test_A' flag...`, JaneDoe, INSTANT);
    await waitFor(() => hasFlag('Debug_Test_A'));
    await textLeft(`OK: 'Debug_Test_A' flag checked.`, JaneDoe, INSTANT);
    removeFlag('Debug_Test_A');

    await textLeft(`TEST: Wait for a never true condition with a 5 second timeout...`, JaneDoe, INSTANT);
    try {
      await waitFor(() => hasFlag('Debug_Test_Never_True'), 5000);
    } catch (error) {
      await textLeft(`OK: Wait for never true condition timed out.`, JaneDoe, INSTANT);
    }

    await textRight(`=====[END] Wait For=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Wait For=====`, JaneDoe, INSTANT);
  }

  if (enableMessageSpeedTest) {
    await textLeft(`=====[START] Message Speed=====`, JaneDoe, INSTANT);

    await textLeft(`Message Speed set to SLOWEST...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(SLOWEST);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Slowest'...`, JaneDoe);
    if (messageSpeedSetting.textContent === 'Slowest') {
      await textLeft(`OK: Message Speed text is 'Slowest'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`Message Speed set to SLOW...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(SLOW);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Slow'...`, JaneDoe);
    if (messageSpeedSetting.textContent === 'Slow') {
      await textLeft(`OK: Message Speed text is 'Slow'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`Message Speed set to NORMAL...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(NORMAL);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Normal'...`, JaneDoe);
    if (messageSpeedSetting.textContent === 'Normal') {
      await textLeft(`OK: Message Speed text is 'Normal'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`Message Speed set to FAST...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(FAST);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Fast'...`, JaneDoe);
    if (messageSpeedSetting.textContent === 'Fast') {
      await textLeft(`OK: Message Speed text is 'Fast'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`Message Speed set to INSTANT...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed(INSTANT);
    await textLeft(`TEST: The Message Speed text in the settings should be 'Instant'...`, JaneDoe);
    if (messageSpeedSetting.textContent === 'Instant') {
      await textLeft(`OK: Message Speed text is 'Instant'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`Message Speed set to default...`, JaneDoe, INSTANT);
    setGlobalMessageSpeed();
    await textLeft(`TEST: The Message Speed text in the settings should be 'Normal'...`, JaneDoe);
    if (messageSpeedSetting.textContent === 'Normal') {
      await textLeft(`OK: Message Speed text is 'Normal'.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Message Speed text is '${messageSpeedSetting.textContent}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textRight(`=====[END] Message Speed=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Message Speed=====`, JaneDoe, INSTANT);
  }

  if (enableClockTest) {
    await textLeft(`=====[START] Clock=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Clock set to: Wednesday, October 1 at 12:00 AM`, JaneDoe, INSTANT);
    setClock(2025, 9, 1, 0);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding 60 minutes...`, JaneDoe, SLOWEST);
    addMinutes(60);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding 330 minutes...`, JaneDoe, SLOWEST);
    addMinutes(330);
    timestamp(JaneDoe);
    await textLeft(`TEST: Subtracting 30 minutes...`, JaneDoe, SLOWEST);
    addMinutes(-30);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding 0 minutes...`, JaneDoe, SLOWEST);
    addMinutes(0);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Thursday, October 2 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, 9, 2, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Friday, October 3 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, 9, 3, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Saturday, October 4 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, 9, 4, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Sunday, October 5 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, 9, 5, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Wednesday, October 8 at 1:00 AM`, JaneDoe, SLOWEST);
    setClock(2025, 9, 8, 1);
    timestamp(JaneDoe);
    await textLeft(`TEST: Multiple timestamps`, JaneDoe, SLOWEST);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    timestamp(JaneDoe);
    await textLeft(`TEST: Clock set to: Saturday, November 1 at 1:30 PM`, JaneDoe, SLOWEST);
    setClock(2025, 10, 1, 13, 30);
    timestamp(JaneDoe);
    await textLeft(`TEST: Adding timestamp for Sarah Smith`, JaneDoe, INSTANT);
    timestamp(SarahSmith);

    await textRight(`=====[END] Clock=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Clock=====`, JaneDoe, INSTANT);
  }

  if (enableBatteryTest) {
    await textLeft(`=====[START] Battery=====`, JaneDoe, INSTANT);

    battery(99);
    await textLeft(`TEST: Battery at [7/7]`, JaneDoe);
    await textLeft(`TEST: Battery -1 at [6/7]`, JaneDoe, SLOW);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [5/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [4/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [3/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [2/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [1/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [0/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [0/7]`, JaneDoe);
    battery(-1);
    await textLeft(`TEST: Battery -1 at [0/7]`, JaneDoe);
    await textLeft(`TEST: Battery +1 at [1/7]`, JaneDoe, SLOW);
    battery(1);
    await textLeft(`TEST: Battery +1 at [2/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [3/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [4/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [5/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [6/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [7/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery +1 at [7/7]`, JaneDoe);
    battery(1);
    await textLeft(`TEST: Battery -5 at [2/7]`, JaneDoe, SLOW);
    battery(-5);

    await textRight(`=====[END] Battery=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Battery=====`, JaneDoe, INSTANT);
  }

  if (enableContactTest) {
    await textLeft(`=====[START] Contact=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Adding contacts...`, JaneDoe, INSTANT);
    contact('Repeatedly', 'Added', 'chapters/debug/images/sample-contact-01.png');
    contact('Repeatedly', 'Added', 'chapters/debug/images/sample-contact-02.png');
    contact('Repeatedly', 'Added', 'chapters/debug/images/sample-contact-03.png');
    const RepeatedlyAdded = contact('Repeatedly', 'Added', 'chapters/debug/images/sample-contact-04.png');
    if (RepeatedlyAdded === 'Repeatedly Added') {
      await textLeft(`OK: 'Repeatedly Added' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: RepeatedlyAdded is '${RepeatedlyAdded}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }
    const DefaultContact = contact('Default', 'Contact', 'chapters/debug/images/default-contact.png');
    if (DefaultContact === 'Default Contact') {
      await textLeft(`OK: 'Default Contact' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: DefaultContact is '${DefaultContact}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }
    const InvalidAvatar = contact('Invalid', 'Avatar', 'chapters/debug/images/invalid-avatar.png');
    if (InvalidAvatar === 'Invalid Avatar') {
      await textLeft(`OK: 'Invalid Avatar' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: InvalidAvatar is '${InvalidAvatar}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }
    const NoAvatar = contact('No', 'Avatar');
    if (NoAvatar === 'No Avatar') {
      await textLeft(`OK: 'No Avatar' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: NoAvatar is '${NoAvatar}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }
    const Sample1 = contact('Sample', '1', 'chapters/debug/images/sample-contact-01.png');
    if (Sample1 === 'Sample 1') {
      await textLeft(`OK: 'Sample 1' name is correct.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: Sample1 is '${Sample1}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }
    contact('Sample', '2', 'chapters/debug/images/sample-contact-02.png');
    contact('Sample', '3', 'chapters/debug/images/sample-contact-03.png');
    contact('Sample', '4', 'chapters/debug/images/sample-contact-04.png');
    contact('Valid Avatar', 'To Invalid Avatar', 'chapters/debug/images/sample-contact-01.png');
    contact('Valid Avatar', 'To Invalid Avatar', 'chapters/debug/images/invalid-avatar.png');
    contact('Valid Avatar', 'To No Avatar', 'chapters/debug/images/sample-contact-01.png');
    contact('Valid Avatar', 'To No Avatar');
    contact('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    contact('Test', '1', 'chapters/debug/images/sample-contact-01.png');
    contact('Test', '2', 'chapters/debug/images/sample-contact-02.png');
    contact('Test', '3', 'chapters/debug/images/sample-contact-03.png');
    contact('Test', '4', 'chapters/debug/images/sample-contact-04.png');
    contact('Test', '5', 'chapters/debug/images/sample-contact-01.png');
    contact('Test', '6', 'chapters/debug/images/sample-contact-02.png');
    contact('Test', '7', 'chapters/debug/images/sample-contact-03.png');
    contact('Test', '8', 'chapters/debug/images/sample-contact-04.png');
    contact('Test', '9', 'chapters/debug/images/sample-contact-01.png');
    contact('Test', '10', 'chapters/debug/images/sample-contact-02.png');
    contact('Test', '11', 'chapters/debug/images/sample-contact-03.png');
    contact('Test', '12', 'chapters/debug/images/sample-contact-04.png');
    contact('123', '456');
    contact('123');
    contact('1');
    contact(undefined, '456');
    contact(undefined, '4');
    contact('', '');
    contact();

    await textRight(`=====[END] Contact=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Contact=====`, JaneDoe, INSTANT);
  }

  if (enableRenameTest) {
    await textLeft(`=====[START] Rename=====`, JaneDoe, INSTANT);

    await textLeft(`Adding 'Before Name'...`, JaneDoe, INSTANT);
    const BeforeName = contact('Before', 'Name');
    await textLeft(`Message from 'Before Name'`, BeforeName, INSTANT);
    await textRight(`Message to 'Before Name'`, BeforeName, INSTANT, INSTANT);
    await textLeft(`Renaming 'Before Name' to 'After Rename'...`, BeforeName, INSTANT);
    await reaction('👍', BeforeName, 0, SLOWEST);
    const AfterRename = rename(BeforeName, 'After', 'Rename');
    if (AfterRename === 'After Rename') {
      await textLeft(`OK: 'After Rename' name is correct.`, AfterRename, INSTANT);
    } else {
      await textLeft(`ERROR: AfterRename name is '${AfterRename}'.`, AfterRename, INSTANT);
      await sleep(20000);
    }
    await textLeft(`Message from 'After Rename'`, AfterRename, INSTANT);
    await textRight(`Message to 'After Rename'`, AfterRename, INSTANT, INSTANT);

    await textLeft(`Renaming 'After Rename' to 'After Rename' (same name)...`, AfterRename, INSTANT);
    await reaction('👍', AfterRename, 0, SLOWEST);
    rename(AfterRename, 'After', 'Rename');
    await textLeft(`Message from 'After Rename'`, AfterRename, INSTANT);
    await textRight(`Message to 'After Rename'`, AfterRename, INSTANT, INSTANT);

    await textLeft(`Renaming 'After Rename' to 'After Rename With Avatar'...`, AfterRename, INSTANT);
    await reaction('👍', AfterRename, 0, SLOWEST);
    const AfterRenameWithAvatar = rename(
      AfterRename,
      'After',
      'Rename With Avatar',
      'chapters/debug/images/sample-contact-01.png',
    );
    await textLeft(`Message from 'After Rename With Avatar'`, AfterRenameWithAvatar, INSTANT);
    await textRight(`Message to 'After Rename With Avatar'`, AfterRenameWithAvatar, INSTANT, INSTANT);

    await textLeft(
      `Renaming 'After Rename With Avatar' to 'After Rename With Invalid Avatar'...`,
      AfterRenameWithAvatar,
      INSTANT,
    );
    await reaction('👍', AfterRenameWithAvatar, 0, SLOWEST);
    const AfterRenameWithInvalidAvatar = rename(
      AfterRenameWithAvatar,
      'After',
      'Rename With Invalid Avatar',
      'chapters/debug/images/invalid-avatar.png',
    );
    await textLeft(`Message from 'After Rename With Invalid Avatar'`, AfterRenameWithInvalidAvatar, INSTANT);
    await textRight(`Message to 'After Rename With Invalid Avatar'`, AfterRenameWithInvalidAvatar, INSTANT, INSTANT);

    await textRight(`=====[END] Rename=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Rename=====`, JaneDoe, INSTANT);
  }

  if (enableActiveContactNameTest) {
    await textLeft(`=====[START] Active Contact Name=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: The active contact name should be 'Jane Doe'...`, JaneDoe, INSTANT);
    if (activeContactName() === 'Jane Doe') {
      await textLeft(`OK: Active contact name is 'Jane Doe'.`, JaneDoe, INSTANT);
    } else {
      await textLeft(`ERROR: Active contact name is '${activeContactName()}'.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textRight(`=====[END] Active Contact Name=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Active Contact Name=====`, JaneDoe, INSTANT);
  }

  if (enableReceivedTextTest) {
    await textLeft(`=====[START] Received Text=====`, JaneDoe, INSTANT);

    await textLeft(`Received message.`, JaneDoe);
    await textLeft('Short', JaneDoe);
    await textLeft('Sh', JaneDoe);
    await textLeft('S', JaneDoe);
    await textLeft('', JaneDoe);
    await textLeft();
    await textLeft(
      `Received message.
With new line.`,
      JaneDoe,
    );
    await textLeft(
      `Received message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.`,
      JaneDoe,
    );
    await textLeft('😃', JaneDoe);
    await textLeft(`Received message with SLOWEST duration.`, JaneDoe, SLOWEST);
    await textLeft(`Received message with SLOW duration.`, JaneDoe, SLOW);
    await textLeft(`Received message with default duration.`, JaneDoe);
    await textLeft(`Received message with NORMAL duration.`, JaneDoe, NORMAL);
    await textLeft(`Received message with FAST duration.`, JaneDoe, FAST);
    await textLeft(`Received message with INSTANT duration.`, JaneDoe, INSTANT);
    await textLeft(`Received message from Sarah Smith.`, SarahSmith);

    await textRight(`=====[END] Received Text=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Received Text=====`, JaneDoe, INSTANT);
  }

  if (enableReceivedMediaTest) {
    await textLeft(`=====[START] Received Media=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Received images...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Dog.jpg', JaneDoe);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe);
    await mediaLeft('chapters/debug/images/Newtons_Cradle.gif', JaneDoe);
    await mediaLeft('chapters/debug/images/invalid-image.png', JaneDoe);
    await mediaLeft('chapters/debug/images/Dog.JPG', JaneDoe);
    await mediaLeft('chapters/debug/images/Cat.PNG', JaneDoe);
    await mediaLeft('chapters/debug/images/Newtons_Cradle.GIF', JaneDoe);
    await mediaLeft('chapters/debug/images/invalid-image.PNG', JaneDoe);

    await textLeft(`TEST: Received videos...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/videos/mov_bbb.mp4', JaneDoe);
    await mediaLeft('chapters/debug/videos/Schlossbergbahn.webm', JaneDoe);
    await mediaLeft('chapters/debug/videos/invalid-video.mp4', JaneDoe);
    await mediaLeft('chapters/debug/videos/mov_bbb.MP4', JaneDoe);
    await mediaLeft('chapters/debug/videos/Schlossbergbahn.WEBM', JaneDoe);
    await mediaLeft('chapters/debug/videos/invalid-video.MP4', JaneDoe);

    await textLeft(
      `TEST: Received invalid media: '.txt' file type.
Should print an error in console...`,
      JaneDoe,
      INSTANT,
    );
    await mediaLeft('chapters/debug/images/invalid-file-type.txt', JaneDoe);

    await textLeft(`TEST: Received media with default duration...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe);
    await textLeft(`TEST: Received media with SLOWEST duration...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe, SLOWEST);
    await textLeft(`TEST: Received media with SLOW duration...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe, SLOW);
    await textLeft(`TEST: Received media with NORMAL duration...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe, NORMAL);
    await textLeft(`TEST: Received media with FAST duration...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe, FAST);
    await textLeft(`TEST: Received media with INSTANT duration...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', JaneDoe, INSTANT);

    await textLeft(`TEST: Received media from Sarah Smith...`, JaneDoe, INSTANT);
    await mediaLeft('chapters/debug/images/Cat.png', SarahSmith, INSTANT);
    await mediaLeft('chapters/debug/videos/mov_bbb.mp4', SarahSmith, INSTANT);

    await textRight(`=====[END] Received Media=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Received Media=====`, JaneDoe, INSTANT);
  }

  if (enableSentTextTest) {
    await textLeft(`=====[START] Sent Text=====`, JaneDoe, INSTANT);

    await textRight(`Sent message.`, JaneDoe);
    await textRight('Short', JaneDoe);
    await textRight('Sh', JaneDoe);
    await textRight('S', JaneDoe);
    await textRight('', JaneDoe);
    await textRight();
    await textRight(
      `Sent message.
With new line.`,
      JaneDoe,
    );
    await textRight(
      `Sent message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.`,
      JaneDoe,
    );
    await textRight('😃', JaneDoe);
    await textLeft(`Received message.`, JaneDoe, INSTANT);
    await textRight(`Sent message with SLOWEST duration.`, JaneDoe, SLOWEST);
    await textRight(`Sent message with SLOW duration.`, JaneDoe, SLOW);
    await textRight(`Sent message with default duration.`, JaneDoe);
    await textRight(`Sent message with NORMAL duration.`, JaneDoe, NORMAL);
    await textRight(`Sent message with FAST duration.`, JaneDoe, FAST);
    await textRight(`Sent message with INSTANT duration.`, JaneDoe, INSTANT);
    await textRight(`Sent message with SLOWEST delay.`, JaneDoe, undefined, SLOWEST);
    await textRight(`Sent message with SLOW delay.`, JaneDoe, undefined, SLOW);
    await textRight(`Sent message with default delay.`, JaneDoe);
    await textRight(`Sent message with NORMAL delay.`, JaneDoe, undefined, NORMAL);
    await textRight(`Sent message with FAST delay.`, JaneDoe, undefined, FAST);
    await textRight(`Sent message with INSTANT delay.`, JaneDoe, undefined, INSTANT);

    await textRight(`=====[END] Sent Text=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Sent Text=====`, JaneDoe, INSTANT);
  }

  if (enableSentMediaTest) {
    await textLeft(`=====[START] Sent Media=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Sent images...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Dog.jpg', JaneDoe);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe);
    await mediaRight('chapters/debug/images/Newtons_Cradle.gif', JaneDoe);
    await mediaRight('chapters/debug/images/invalid-image.png', JaneDoe);
    await mediaRight('chapters/debug/images/Dog.JPG', JaneDoe);
    await mediaRight('chapters/debug/images/Cat.PNG', JaneDoe);
    await mediaRight('chapters/debug/images/Newtons_Cradle.GIF', JaneDoe);
    await mediaRight('chapters/debug/images/invalid-image.PNG', JaneDoe);

    await textLeft(`TEST: Sent videos...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/videos/mov_bbb.mp4', JaneDoe);
    await mediaRight('chapters/debug/videos/Schlossbergbahn.webm', JaneDoe);
    await mediaRight('chapters/debug/videos/invalid-video.mp4', JaneDoe);
    await mediaRight('chapters/debug/videos/mov_bbb.MP4', JaneDoe);
    await mediaRight('chapters/debug/videos/Schlossbergbahn.WEBM', JaneDoe);
    await mediaRight('chapters/debug/videos/invalid-video.MP4', JaneDoe);

    await textLeft(
      `TEST: Sent invalid media: '.txt' file type.
Should print an error in console...`,
      JaneDoe,
      INSTANT,
    );
    await mediaRight('chapters/debug/images/invalid-file-type.txt', JaneDoe);

    await textLeft(`TEST: Sent media with SLOWEST duration...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, SLOWEST);
    await textLeft(`TEST: Sent media with default duration...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe);
    await textLeft(`TEST: Sent media with SLOW duration...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, SLOW);
    await textLeft(`TEST: Sent media with NORMAL duration...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, NORMAL);
    await textLeft(`TEST: Sent media with FAST duration...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, FAST);
    await textLeft(`TEST: Sent media with INSTANT duration...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, INSTANT);

    await textLeft(`TEST: Sent media with SLOWEST delay...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, undefined, SLOWEST);
    await textLeft(`TEST: Sent media with default delay...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe);
    await textLeft(`TEST: Sent media with SLOW delay...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, undefined, SLOW);
    await textLeft(`TEST: Sent media with NORMAL delay...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, undefined, NORMAL);
    await textLeft(`TEST: Sent media with FAST delay...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, undefined, FAST);
    await textLeft(`TEST: Sent media with INSTANT delay...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', JaneDoe, undefined, INSTANT);

    await textLeft(`TEST: Sending media to Sarah Smith...`, JaneDoe, INSTANT);
    await mediaRight('chapters/debug/images/Cat.png', SarahSmith, INSTANT, INSTANT);
    await mediaRight('chapters/debug/videos/mov_bbb.mp4', SarahSmith, INSTANT, INSTANT);

    await textRight(`=====[END] Sent Media=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Sent Media=====`, JaneDoe, INSTANT);
  }

  if (enableReactionTest) {
    await textLeft(`=====[START] Reaction=====`, JaneDoe, INSTANT);

    await textLeft(`Received message as filler.`, JaneDoe, INSTANT);
    await textRight(`TEST: Should have thumbs up emoji...`, JaneDoe, INSTANT, INSTANT);
    await reaction('👍', JaneDoe);
    await textLeft('A', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textLeft('Ab', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textLeft('Abc', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textLeft('Abcd', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textRight('A', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textRight('Ab', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textRight('Abc', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textRight('Abcd', JaneDoe);
    await reaction('❤️', JaneDoe);
    await textLeft(`TEST: Should have smile emoji...`, JaneDoe, INSTANT);
    await textRight(`Sent message: Will react with emoji.`, JaneDoe, INSTANT, INSTANT);
    await reaction('😃', JaneDoe, 1);
    await textLeft(`TEST: Negative 'lastMessageAgo', should NOT have any emojis...`, JaneDoe, INSTANT);
    await reaction('😈', JaneDoe, -1);
    await textLeft(`TEST: 9999 'lastMessageAgo', should NOT have any emojis...`, JaneDoe, INSTANT);
    await reaction('⛔️', JaneDoe, 9999);
    await textRight(
      `Sent message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text. TEST: Should have embarrassed emoji...`,
      JaneDoe,
      INSTANT,
      INSTANT,
    );
    await textLeft(
      `Received message with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.
TEST: Should have throwing kiss emoji...`,
      JaneDoe,
      INSTANT,
    );
    await textRight(`Sent message as filler.`, JaneDoe, INSTANT, INSTANT);
    await reaction('😅', JaneDoe, 2);
    await reaction('😘', JaneDoe, 1);

    await textLeft(`TEST: Should have heart-shaped eyes emoji with SLOWEST duration...`, JaneDoe, INSTANT);
    await reaction('😍', JaneDoe, 0, SLOWEST);
    await textLeft(`TEST: Should have scream emoji with SLOW duration...`, JaneDoe, INSTANT);
    await reaction('😱', JaneDoe, 0, SLOW);
    await textLeft(`TEST: Should have no mouth emoji with default duration...`, JaneDoe, INSTANT);
    await reaction('😶', JaneDoe, 0);
    await textLeft(`TEST: Should have medical mask emoji with NORMAL duration...`, JaneDoe, INSTANT);
    await reaction('😷', JaneDoe, 0, NORMAL);
    await textLeft(`TEST: Should have cold sweat emoji with FAST duration...`, JaneDoe, INSTANT);
    await reaction('😓', JaneDoe, 0, FAST);
    await textLeft(`TEST: Should have sleepy emoji with INSTANT duration...`, JaneDoe, INSTANT);
    await reaction('😪', JaneDoe, 0, INSTANT);

    await textLeft(`TEST: Should have overwritten emojis from 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8...`, JaneDoe, INSTANT);
    await reaction('1️', JaneDoe, 0, FAST);
    await reaction('2️', JaneDoe, 0, FAST);
    await reaction('3️', JaneDoe, 0, FAST);
    await reaction('4️', JaneDoe, 0, FAST);
    await reaction('5️', JaneDoe, undefined, FAST);
    await reaction('6️', JaneDoe, undefined, FAST);
    await reaction('7️', JaneDoe, undefined, FAST);
    await reaction('8️', JaneDoe, undefined, FAST);

    await textLeft(`TEST: Should have fearful emoji...`, JaneDoe, INSTANT);
    await reaction('😨', JaneDoe, 0);
    await textLeft(`TEST: Removing fearful emoji...`, JaneDoe, SLOWEST);
    await reaction('😨', JaneDoe, 1);

    await textLeft(`TEST: Should have neutral face expression emoji...`, SarahSmith, INSTANT);
    await textLeft(`TEST: Filler, should have no emojis...`, SarahSmith, INSTANT);
    await textLeft(`TEST: Should have wink emoji...`, SarahSmith, INSTANT);
    await reaction('😐', SarahSmith, 2);
    await reaction('😉', SarahSmith);

    await textRight(`=====[END] Reaction=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Reaction=====`, JaneDoe, INSTANT);
  }

  if (enableChoiceTest) {
    await textLeft(`=====[START] Choice=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Choice with default typing speed...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: 'Option A_1.',
          fullText: `I am choosing Option A_1 with default typing speed.`,
          callback: () => {
            notification('Option A_1 Callback', JaneDoe);
          },
        },
        {
          displayText: 'Option A_2.',
          fullText: `I am choosing Option A_2 with default typing speed.`,
          callback: () => {
            notification('Option A_2 Callback', JaneDoe);
          },
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with slow typing speed...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: 'Option B_1.',
          fullText: `I am choosing Option B_1 with slow typing speed.`,
          typingSpeedDelay: 30,
          callback: () => {
            notification('Option B_1 Callback', JaneDoe);
          },
        },
        {
          displayText: 'Option B_2.',
          fullText: `I am choosing Option B_2 with slow typing speed.`,
          typingSpeedDelay: 30,
          callback: () => {
            notification('Option B_2 Callback', JaneDoe);
          },
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with no delay typing speed...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: 'Option C_1.',
          fullText: `I am choosing Option C_1 with no delay typing speed.`,
          typingSpeedDelay: 0,
          callback: () => {
            notification('Option C_1 Callback', JaneDoe);
          },
        },
        {
          displayText: 'Option C_2.',
          fullText: `I am choosing Option C_2 with no delay typing speed.`,
          typingSpeedDelay: 0,
          callback: () => {
            notification('Option C_2 Callback', JaneDoe);
          },
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with no display text...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          fullText: `I am choosing Option D_1 with no display text.`,
          callback: () => {
            notification('Option D_1 Callback', JaneDoe);
          },
        },
        {
          fullText: `I am choosing Option D_2 with no display text.`,
          callback: () => {
            notification('Option D_2 Callback', JaneDoe);
          },
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with no callback...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: 'Option E_1.',
          fullText: `I am choosing Option E_1 with no callback.`,
        },
        {
          displayText: 'Option E_2.',
          fullText: `I am choosing Option E_2 with no callback.`,
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with four options...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: 'Option F_1.',
          fullText: `I am choosing Option F_1 out of four options.`,
          callback: () => {
            notification('Option F_1 Callback', JaneDoe);
          },
        },
        {
          displayText: 'Option F_2.',
          fullText: `I am choosing Option F_2 out of four options.`,
          callback: () => {
            notification('Option F_2 Callback', JaneDoe);
          },
        },
        {
          displayText: 'Option F_3.',
          fullText: `I am choosing Option F_3 out of four options.`,
          callback: () => {
            notification('Option F_3 Callback', JaneDoe);
          },
        },
        {
          displayText: 'Option F_4.',
          fullText: `I am choosing Option F_4 out of four options.`,
          callback: () => {
            notification('Option F_4 Callback', JaneDoe);
          },
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with one option...`, JaneDoe, INSTANT);
    await choices(
      [
        {
          displayText: 'Option G_1.',
          fullText: `I am choosing Option G_1 with one option.`,
          callback: () => {
            notification('Option G_1 Callback', JaneDoe);
          },
        },
      ],
      JaneDoe,
    );

    await textLeft(`TEST: Choice with no options...`, JaneDoe, INSTANT);
    await choices([], JaneDoe);

    await textRight(`=====[END] Choice=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Choice=====`, JaneDoe, INSTANT);
  }

  if (enableFlagTest) {
    await textLeft(`=====[START] Flag=====`, JaneDoe, INSTANT);

    await textLeft(`Adding 'Debug_Test_A' flag...`, JaneDoe);
    addFlag('Debug_Test_A');
    await textLeft(`TEST: Should have 'Debug_Test_A' flag...`, JaneDoe);
    if (hasFlag('Debug_Test_A')) {
      await textLeft(`OK: Found 'Debug_Test_A' flag.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Cannot find 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`TEST: Again, should have 'Debug_Test_A' flag...`, JaneDoe);
    if (hasFlags(['Debug_Test_A'])) {
      await textLeft(`OK: Found 'Debug_Test_A' flag.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Cannot find 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(`Adding 'Debug_Test_A' flag again...`, JaneDoe);
    addFlag('Debug_Test_A');

    await textLeft(`Adding 'Debug_Test_B' flag...`, JaneDoe);
    addFlag('Debug_Test_B');
    await textLeft(`TEST: Should have both 'Debug_Test_A' and 'Debug_Test_B' flags...`, JaneDoe);
    if (hasFlags(['Debug_Test_A', 'Debug_Test_B'])) {
      await textLeft(`OK: Found 'Debug_Test_A' and 'Debug_Test_B' flags.`, JaneDoe);
    } else {
      await textLeft(`ERROR: Cannot find 'Debug_Test_A' and/or 'Debug_Test_B' flags.`, JaneDoe, INSTANT);
      await sleep(20000);
    }

    await textLeft(
      `Removing 'Debug_Test_A' flag.
TEST: Should not have 'Debug_Test_A' flag...`,
      JaneDoe,
    );
    removeFlag('Debug_Test_A');
    if (hasFlag('Debug_Test_A')) {
      await textLeft(`ERROR: Found 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(20000);
    } else {
      await textLeft(`OK: Does not have 'Debug_Test_A' flag.`, JaneDoe);
    }
    await textLeft(`Removing 'Debug_Test_B' flag...`, JaneDoe);
    removeFlag('Debug_Test_B');
    await textLeft(`Removing 'Debug_Test_B' flag again...`, JaneDoe);
    removeFlag('Debug_Test_B');

    await textLeft(`TEST: Should not have 'Debug_Test_A' flag...`, JaneDoe);
    if (hasFlag('Debug_Test_A')) {
      await textLeft(`ERROR: Found 'Debug_Test_A' flag.`, JaneDoe, INSTANT);
      await sleep(20000);
    } else {
      await textLeft(`OK: Does not have 'Debug_Test_A' flag.`, JaneDoe);
    }

    await textLeft(`TEST: Should not have 'Debug_Test_B' flag...`, JaneDoe);
    if (hasFlag('Debug_Test_B')) {
      await textLeft(`ERROR: Found 'Debug_Test_B' flag.`, JaneDoe, INSTANT);
      await sleep(20000);
    } else {
      await textLeft(`OK: Does not have 'Debug_Test_B' flag.`, JaneDoe);
    }

    await textRight(`=====[END] Flag=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Flag=====`, JaneDoe, INSTANT);
  }

  if (enableNotificationTest) {
    await textLeft(`=====[START] Notification=====`, JaneDoe, INSTANT);

    await textLeft(`TEST: Notification from Sarah Smith...`, JaneDoe, SLOWEST);
    await textLeft(`Received new message from Sarah Smith.`, SarahSmith);

    await textLeft(`TEST: Notification with regular message...`, JaneDoe, SLOWEST);
    notification('Notification Test 1', JaneDoe);
    await textLeft(`TEST: Notification with 'S' message...`, JaneDoe, SLOWEST);
    notification('S', JaneDoe);
    await textLeft(`TEST: Notification with empty message...`, JaneDoe, SLOWEST);
    notification('', JaneDoe);
    await textLeft(`TEST: Notification with undefined message...`, JaneDoe, SLOWEST);
    notification(undefined, JaneDoe);
    await textLeft(`TEST: Notification with new line...`, JaneDoe, SLOWEST);
    notification(
      `Notification Test 2.
With new line.`,
      JaneDoe,
    );
    await textLeft(`TEST: Notification with a long message...`, JaneDoe, SLOWEST);
    notification(
      `Notification Test 3 with a very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long text.`,
      JaneDoe,
    );
    await textLeft(`TEST: Notification with an emoji message...`, JaneDoe, SLOWEST);
    notification('😃', JaneDoe);

    await textLeft(`TEST: Notification with name as 'Test Name'...`, JaneDoe, SLOWEST);
    notification('Notification Test 4', 'Test Name');
    await textLeft(`TEST: Notification with an empty name...`, JaneDoe, SLOWEST);
    notification('Notification Test 5', '');
    await textLeft(`TEST: Notification with an undefined name...`, JaneDoe, SLOWEST);
    notification('Notification Test 6', undefined);
    await textLeft(`TEST: Notification with a new line name...`, JaneDoe, SLOWEST);
    notification(
      'Notification Test 7',
      `Test Name.
With new line.`,
    );
    await textLeft(`TEST: Notification with a very long name...`, JaneDoe, SLOWEST);
    notification(
      'Notification Test 8',
      'A very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long name.',
    );
    await textLeft(`TEST: Notification with an emoji name...`, JaneDoe, SLOWEST);
    notification('Notification Test 9', '😃');

    await textLeft(`TEST: Notification with app name as 'Test App'...`, JaneDoe, SLOWEST);
    notification('Notification Test 10', JaneDoe, 'Test App');
    await textLeft(`TEST: Notification with an empty app name...`, JaneDoe, SLOWEST);
    notification('Notification Test 11', JaneDoe, '');
    await textLeft(`TEST: Notification with a new line app name...`, JaneDoe, SLOWEST);
    notification(
      'Notification Test 12',
      JaneDoe,
      `App name.
With new line.`,
    );
    await textLeft(`TEST: Notification with a very long app name...`, JaneDoe, SLOWEST);
    notification(
      'Notification Test 13',
      JaneDoe,
      'A very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very long app name.',
    );
    await textLeft(`TEST: Notification with an emoji app name...`, JaneDoe, SLOWEST);
    notification('Notification Test 14', JaneDoe, '😃');

    await textLeft(`TEST: Notification with time now...`, JaneDoe, SLOWEST);
    notification('Notification Test 15', JaneDoe);
    await textLeft(`TEST: Notification with time 1 second ago...`, JaneDoe, SLOWEST);
    notification('Notification Test 16', JaneDoe, undefined, new Date(player.date.getTime() - 1 * 1000));
    await textLeft(`TEST: Notification with time 30 seconds ago...`, JaneDoe, SLOWEST);
    notification('Notification Test 17', JaneDoe, undefined, new Date(player.date.getTime() - 30 * 1000));
    await textLeft(`TEST: Notification with time 30 minutes ago...`, JaneDoe, SLOWEST);
    notification('Notification Test 18', JaneDoe, undefined, new Date(player.date.getTime() - 30 * 60 * 1000));
    await textLeft(`TEST: Notification with time 1 hour ago...`, JaneDoe, SLOWEST);
    notification('Notification Test 19', JaneDoe, undefined, new Date(player.date.getTime() - 1 * 60 * 60 * 1000));
    await textLeft(`TEST: Notification with time 1 day ago...`, JaneDoe, SLOWEST);
    notification('Notification Test 20', JaneDoe, undefined, new Date(player.date.getTime() - 1 * 24 * 60 * 60 * 1000));
    await textLeft(`TEST: Notification with time 1 week ago...`, JaneDoe, SLOWEST);
    notification(
      'Notification Test 21',
      JaneDoe,
      undefined,
      new Date(player.date.getTime() - 1 * 7 * 24 * 60 * 60 * 1000),
    );
    await textLeft(`TEST: Notification with time 1 month ago...`, JaneDoe, SLOWEST);
    notification(
      'Notification Test 22',
      JaneDoe,
      undefined,
      new Date(player.date.getTime() - 1 * 31 * 24 * 60 * 60 * 1000),
    );
    await textLeft(`TEST: Notification with time 30 minutes from now...`, JaneDoe, SLOWEST);
    notification('Notification Test 23', JaneDoe, undefined, new Date(player.date.getTime() + 30 * 60 * 1000));

    await textLeft(`TEST: Three notifications at once...`, JaneDoe, SLOWEST);
    notification('Notification Test 24', JaneDoe);
    notification('Notification Test 25', JaneDoe);
    notification('Notification Test 26', JaneDoe);
    await textLeft(`TEST: Many notifications at once...`, JaneDoe, SLOWEST);
    notification('Notification Test 27', JaneDoe);
    notification('Notification Test 28', JaneDoe);
    notification('Notification Test 29', JaneDoe);
    notification('Notification Test 30', JaneDoe);
    notification('Notification Test 31', JaneDoe);
    notification('Notification Test 32', JaneDoe);
    notification('Notification Test 33', JaneDoe);
    notification('Notification Test 34', JaneDoe);
    notification('Notification Test 35', JaneDoe);
    notification('Notification Test 36', JaneDoe);
    notification('Notification Test 37', JaneDoe);
    notification('Notification Test 38', JaneDoe);
    notification('Notification Test 39', JaneDoe);
    notification('Notification Test 40', JaneDoe);

    await textRight(`=====[END] Notification=====`, JaneDoe, INSTANT, INSTANT);
  } else {
    await textLeft(`=====[SKIP] Notification=====`, JaneDoe, INSTANT);
  }

  await textLeft(`=====[END] Unit Tests Done=====`, JaneDoe, INSTANT);
})();
