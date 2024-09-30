export interface TimeAgoConfig {
    years?: [singular: string, plural: string];
    months?: [singular: string, plural: string];
    days?: [singular: string, plural: string];
    hours?: [singular: string, plural: string];
    minutes?: [singular: string, plural: string];
    seconds?: [singular: string, plural: string];
    template?: string;
}

export function timeAgo(date: string | Date, config: TimeAgoConfig = {}): string {
    const now = new Date();
    const then = typeof date === 'string' ? new Date(date) : date;

    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    const defaultConfig: TimeAgoConfig = {
        years: ['year', 'years'],
        months: ['month', 'months'],
        days: ['day', 'days'],
        hours: ['hour', 'hours'],
        minutes: ['minute', 'minutes'],
        seconds: ['second', 'seconds'],
        template: '{value} {unit} ago',
    };


    const finalConfig = { ...defaultConfig, ...config };

    function formatOutput(value: number, unit: string): string {
        const template = finalConfig.template ?? defaultConfig.template;
        return (template ?? defaultConfig.template)!.replace('{value}', value.toString()).replace('{unit}', unit);
    }

    if (interval > 1) {
        return formatOutput(interval, (finalConfig.years ?? defaultConfig.years)![1]);
    } else if (interval === 1) {
        return formatOutput(1, (finalConfig.years ?? defaultConfig.years)![0]);
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return formatOutput(interval, (finalConfig.months ?? defaultConfig.months)![1]);
    } else if (interval === 1) {
        return formatOutput(1, (finalConfig.months ?? defaultConfig.months)![0]);
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return formatOutput(interval, (finalConfig.days ?? defaultConfig.days)![1]);
    } else if (interval === 1) {
        return formatOutput(1, (finalConfig.days ?? defaultConfig.days)![0]);
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return formatOutput(interval, (finalConfig.hours ?? defaultConfig.hours)![1]);
    } else if (interval === 1) {
        return formatOutput(1, (finalConfig.hours ?? defaultConfig.hours)![0]);
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return formatOutput(interval, (finalConfig.minutes ?? defaultConfig.minutes)![1]);
    } else if (interval === 1) {
        return formatOutput(1, (finalConfig.minutes ?? defaultConfig.minutes)![0]);
    }

    return formatOutput(Math.floor(seconds), seconds > 1 ? (finalConfig.seconds ?? defaultConfig.seconds)![1] : (finalConfig.seconds ?? defaultConfig.seconds)![0]);
}
