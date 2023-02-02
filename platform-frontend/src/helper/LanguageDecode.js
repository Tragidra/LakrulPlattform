class LanguageDecode {
    // decide a given language short code (from twitter) and return the full language

    // https://gist.github.com/piraveen/fafd0d984b2236e809d03a0e306c8a4d
    langs = {
        'am': 'Amharic',
        'de': 'German',
        'ml': 'Malayalam',
        'sk': 'Slovak',
        'ar': 'Arabic',
        'el': 'Greek',
        'dv': 'Maldivian',
        'sl': 'Slovenian',
        'hy': 'Armenian',
        'gu': 'Gujarati',
        'mr': 'Marathi',
        'ckb': 'Sorani Kurdish',
        'eu': 'Basque',
        'ht': 'Haitian Creole',
        'ne': 'Nepali',
        'es': 'Spanish',
        'bn': 'Bengali',
        'iw': 'Hebrew',
        'no': 'Norwegian',
        'sv': 'Swedish',
        'bs': 'Bosnian',
        'hi': 'Hindi',
        'or': 'Oriya',
        'tl': 'Tagalog',
        'bg': 'Bulgarian',
        'hi-Latn': 'Latinized Hindi',
        'pa': 'Panjabi',
        'ta': 'Tamil',
        'my': 'Burmese',
        'hu': 'Hungarian',
        'ps': 'Pashto',
        'te': 'Telugu',
        'hr': 'Croatian',
        'is': 'Icelandic',
        'fa': 'Persian',
        'th': 'Thai',
        'ca': 'Catalan',
        'in': 'Indonesian',
        'pl': 'Polish',
        'bo': 'Tibetan',
        'cs': 'Czech',
        'it': 'Italian',
        'pt': 'Portuguese',
        'zh-TW': 'Traditional Chinese',
        'da': 'Danish',
        'ja': 'Japanese',
        'ro': 'Romanian',
        'tr': 'Turkish',
        'nl': 'Dutch',
        'kn': 'Kannada',
        'ru': 'Russian',
        'uk': 'Ukrainian',
        'en': 'English',
        'km': 'Khmer',
        'sr': 'Serbian',
        'ur': 'Urdu',
        'et': 'Estonian',
        'ko': 'Korean',
        'zh-CN': 'Simplified Chinese',
        'ug': 'Uyghur',
        'fi': 'Finnish',
        'lo': 'Lao',
        'sd': 'Sindhi',
        'vi': 'Vietnamese',
        'fr': 'French',
        'lv': 'Latvian',
        'si': 'Sinhala',
        'cy': 'Welsh',
        'ka': 'Georgian',
        'lt': 'Lithuanian'
    };

    decode(lang) {
        if (lang === 'total') {
            return lang;
        }
        if (lang in this.langs) {
            return this.langs[lang];
        }
        return 'Unknown';
    }
}

export default new LanguageDecode();
