var MessageSpeed;
(function (MessageSpeed) {
    MessageSpeed[MessageSpeed["INSTANT"] = 0] = "INSTANT";
    MessageSpeed[MessageSpeed["FAST"] = 500] = "FAST";
    MessageSpeed[MessageSpeed["NORMAL"] = 1000] = "NORMAL";
    MessageSpeed[MessageSpeed["SLOW"] = 2000] = "SLOW";
    MessageSpeed[MessageSpeed["SLOWEST"] = 4000] = "SLOWEST";
})(MessageSpeed || (MessageSpeed = {}));
const INSTANT = MessageSpeed.INSTANT;
const FAST = MessageSpeed.FAST;
const NORMAL = MessageSpeed.NORMAL;
const SLOW = MessageSpeed.SLOW;
const SLOWEST = MessageSpeed.SLOWEST;
const DEFAULT_TYPING_SPEED_DELAY = 10;
const sides = ['received', 'sent'];
const BATTERY_PERCENT_PER_STAGE = 100 / 7;
//# sourceMappingURL=model.js.map