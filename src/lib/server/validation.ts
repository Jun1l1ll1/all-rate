export function requiredText(value: FormDataEntryValue | null, field: string, maxLength: number) {
    if (typeof value !== 'string') return `${field} is required.`;

    const normalized = value.trim();
    if (!normalized) return `${field} is required.`;
    if (normalized.length > maxLength) return `${field} must be ${maxLength} characters or fewer.`;

    return null;
}

export function optionalText(value: FormDataEntryValue | null, maxLength: number) {
    if (value === null || value === '') return null;
    if (typeof value !== 'string' || value.length > maxLength) {
        return `Text must be ${maxLength} characters or fewer.`;
    }

    return null;
}

export function formText(value: FormDataEntryValue | null) {
    return typeof value === 'string' ? value.trim() : '';
}
