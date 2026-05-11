import { ref } from 'vue';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const isScanning = ref(false);
  const extractedText = ref('');
  const extractedAmount = ref(null);
  const error = ref(null);

  /**
   * Helper to parse the total amount from OCR text.
   * Looks for "TOTAL", "Rp", etc. and extracts the largest number or number right after.
   * @param {string} text
   * @returns {number|null}
   */
  const parseTotalAmount = (text) => {
    if (!text) return null;

    // Normalize text: uppercase, remove multiple spaces
    const normalizedText = text.toUpperCase().replace(/\s+/g, ' ');

    // Match lines that might contain "TOTAL"
    // e.g., "TOTAL 55.000", "TOTAL RP 55.000", "GRAND TOTAL 55,000"

    // Try to find the word TOTAL and the numbers around it
    const totalRegex = /TOTAL[^\d]*?([\d.,]+)/i;
    const match = normalizedText.match(totalRegex);

    if (match && match[1]) {
      // Clean up the number string (remove dots, commas, etc. to get purely digits)
      // Usually in Indonesia, . is thousand separator and , is decimal, or vice versa
      // We will just extract all digits to form the number, assuming no decimals for simple totals
      const numberStr = match[1].replace(/[^\d]/g, '');
      if (numberStr) {
        return parseInt(numberStr, 10);
      }
    }

    // Fallback: just find the largest number in the text
    const allNumbersMatch = text.match(/\d[.\d,]*/g);
    if (allNumbersMatch) {
      let maxNum = 0;
      for (const numStr of allNumbersMatch) {
        const cleanNum = parseInt(numStr.replace(/[^\d]/g, ''), 10);
        if (!isNaN(cleanNum) && cleanNum > maxNum) {
          maxNum = cleanNum;
        }
      }
      return maxNum > 0 ? maxNum : null;
    }

    return null;
  };

  /**
   * Processes the image using Tesseract.js
   * @param {File} imageFile
   */
  const scanImage = async (imageFile) => {
    isScanning.value = true;
    error.value = null;
    extractedText.value = '';
    extractedAmount.value = null;

    try {
      const result = await Tesseract.recognize(
        imageFile,
        'eng+ind', // Support English and Indonesian
        {
          // Optional logger for progress if needed
          // logger: m => console.log(m)
        }
      );

      extractedText.value = result.data.text;
      extractedAmount.value = parseTotalAmount(result.data.text);

    } catch (err) {
      console.error('OCR Error:', err);
      error.value = 'Failed to scan receipt. Please try again.';
    } finally {
      isScanning.value = false;
    }
  };

  return {
    isScanning,
    extractedText,
    extractedAmount,
    error,
    scanImage,
    parseTotalAmount // Exported for testing if needed
  };
}
