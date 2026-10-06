export const normalizeCommand = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export const toBits = (char) => char.charCodeAt(0).toString(2).padStart(8, '0');
export const pad2 = (value) => String(value).padStart(2, '0');
