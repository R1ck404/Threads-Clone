export interface NumberFormatConfig {
    thousand?: string;
    million?: string;
    billion?: string;
    trillion?: string;
    template?: string;
}

export function formatNumber(value: number, config: NumberFormatConfig = {}): string {
    const defaultConfig: NumberFormatConfig = {
        thousand: 'k',
        million: 'M',
        billion: 'B',
        trillion: 'T',
        template: '{value}{unit}',
    };

    const finalConfig = { ...defaultConfig, ...config };

    function formatOutput(value: number, unit: string): string {
        const template = finalConfig.template ?? defaultConfig.template;
        return template!.replace('{value}', value.toString()).replace('{unit}', unit);
    }

    if (value >= 1_000_000_000_000) {
        return formatOutput(parseFloat((value / 1_000_000_000_000).toFixed(1)), finalConfig.trillion ?? defaultConfig.trillion!);
    } else if (value >= 1_000_000_000) {
        return formatOutput(parseFloat((value / 1_000_000_000).toFixed(1)), finalConfig.billion ?? defaultConfig.billion!);
    } else if (value >= 1_000_000) {
        return formatOutput(parseFloat((value / 1_000_000).toFixed(1)), finalConfig.million ?? defaultConfig.million!);
    } else if (value >= 1_000) {
        return formatOutput(parseFloat((value / 1_000).toFixed(1)), finalConfig.thousand ?? defaultConfig.thousand!);
    }

    return value.toString();
}
