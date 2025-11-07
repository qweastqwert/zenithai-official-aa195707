import { filterContent, FilterResult } from './contentFilter';
import { toast } from 'sonner';

export interface ContentValidationResult {
  isValid: boolean;
  filteredContent?: string;
  errorMessage?: string;
}

export interface ValidationConfig {
  maxLength: number;
  fieldName: string;
  userAge?: number;
  required?: boolean;
}

/**
 * Validates and filters user-generated content
 * Combines length validation, content filtering, and user-friendly error messages
 * 
 * @param content - The content to validate
 * @param config - Validation configuration
 * @returns Validation result with filtered content or error message
 */
export function validateContent(
  content: string,
  config: ValidationConfig
): ContentValidationResult {
  const { maxLength, fieldName, userAge = 18, required = true } = config;

  // Check if content is empty
  const trimmedContent = content.trim();
  if (required && !trimmedContent) {
    return {
      isValid: false,
      errorMessage: `${fieldName} cannot be empty`,
    };
  }

  // Check length
  if (trimmedContent.length > maxLength) {
    return {
      isValid: false,
      errorMessage: `${fieldName} must be less than ${maxLength} characters`,
    };
  }

  // Apply content filtering
  const filterResult: FilterResult = filterContent(trimmedContent, userAge);
  
  if (!filterResult.isAllowed) {
    return {
      isValid: false,
      errorMessage: `Content violates community guidelines. Please revise your ${fieldName.toLowerCase()}.`,
    };
  }

  return {
    isValid: true,
    filteredContent: filterResult.filteredContent,
  };
}

/**
 * Validates content and shows toast error if invalid
 * Convenience wrapper for form submissions
 * 
 * @param content - The content to validate
 * @param config - Validation configuration
 * @returns Filtered content if valid, null if invalid (with toast shown)
 */
export function validateContentWithToast(
  content: string,
  config: ValidationConfig
): string | null {
  const result = validateContent(content, config);
  
  if (!result.isValid) {
    toast.error(result.errorMessage);
    return null;
  }
  
  return result.filteredContent || content;
}
