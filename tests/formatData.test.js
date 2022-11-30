import { formatNumber, formatAddressForDisplay, formatAmount } from '../src/formatData';
import { SAMPLE_TX } from './stubs';

describe('formatData', () => {
    test("formatNumber", () => {
        expect(formatNumber(0)).toBe('0');
        expect(formatNumber(10.000001)).toBe('10.000\'001');
        expect(formatNumber(0.00000001)).toBe('1e-8');
        expect(formatNumber(123456789)).toBe('123\'456\'789');
    });

    test("formatAddressForDisplay", () => {
        const NB_CHARS = 12;

        expect(formatAddressForDisplay('0x0000000000000000000000000000000000000000', NB_CHARS)).toBe("0x0000...000000");
        expect(formatAddressForDisplay('0x0000000000000000000000000000000000000001', NB_CHARS)).toBe("0x0000...000001");
        expect(formatAddressForDisplay('', NB_CHARS)).toBe('N/A');
    });

    test("formatAmount", () => {
        expect(formatAmount(SAMPLE_TX)).toBe('1\'000\'000.00');
    });
});