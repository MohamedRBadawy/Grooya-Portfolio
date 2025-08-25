
import { translations } from '../localization';
import { useApp } from '../contexts/LocalizationContext';

/**
 * A custom hook for handling internationalization (i18n).
 * It provides a `t` function to get translated strings based on the current language context.
 * @returns An object containing the `t` function.
 */
export const useTranslation = () => {
    const { language } = useApp();

    /**
     * Translates a given key into the current language.
     * @param key The key of the translation string (e.g., 'welcomeBack').
     * @param replacements An optional object for dynamic value substitution (e.g., { name: 'Alex' }).
     * @returns The translated string, or the key itself if no translation is found.
     */
    const t = (key: string, replacements?: { [key: string]: string | number }): string => {
        // Find the translation string for the current language, or fallback to the key.
        let translation = translations[language]?.[key] || translations['en']?.[key] || key;
        
        // If replacements are provided, substitute placeholders like {{name}}.
        if (replacements) {
            Object.keys(replacements).forEach(placeholder => {
                const regex = new RegExp(`{{${placeholder}}}`, 'g');
                translation = translation.replace(regex, String(replacements[placeholder]));
            });
        }

        return translation;
    };

    return { t };
};
