export function formatCents(cents: string | number) {
    const value = Number(cents) / 100;

    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(value);
}