const formatRelativeTime = (fromDate, toDate) => {
    const time = new Date(toDate).getTime();
    const deltaSeconds = Math.round((time - fromDate.getTime()) / 1000);
    const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
    const units = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
    const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
    const value = Math.floor(Math.abs(deltaSeconds) / divisor) * Math.sign(deltaSeconds);
    const unit = units[unitIndex];
    const formatter = new Intl.RelativeTimeFormat(navigator.language, { numeric: 'auto' });
    return formatter.format(value, unit);
};
const formatSpecificRelativeDate = (now, toDate) => {
    const date = new Date(toDate);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' };
    if (date.toLocaleDateString(navigator.language, { timeZone: 'UTC' }) ===
        now.toLocaleDateString(navigator.language, { timeZone: 'UTC' })) {
        return `Today ${date.toLocaleTimeString(navigator.language, timeOptions)}`;
    }
    else if (date.toLocaleDateString(navigator.language, { timeZone: 'UTC' }) ===
        tomorrow.toLocaleDateString(navigator.language, { timeZone: 'UTC' })) {
        return `Tomorrow ${date.toLocaleTimeString(navigator.language, timeOptions)}`;
    }
    else if (date.toLocaleDateString(navigator.language, { timeZone: 'UTC' }) ===
        yesterday.toLocaleDateString(navigator.language, { timeZone: 'UTC' })) {
        return `Yesterday ${date.toLocaleTimeString(navigator.language, timeOptions)}`;
    }
    else {
        return date.toLocaleString(navigator.language, Object.assign({ weekday: 'long', month: 'long', day: 'numeric' }, timeOptions));
    }
};
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
//# sourceMappingURL=utility.js.map