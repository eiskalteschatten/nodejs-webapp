function translate(string) {
    var langStrings = translations.translations[lang];

    var useDefaultLangage = function() {
        var defaultStrings = translations[localesDefaultLanguage];

        if (defaultStrings && defaultStrings[string]) {
            return defaultStrings[string];
        }
    };

    if (langStrings && langStrings[string]) {
        return langStrings[string];
    }
    else {
        return useDefaultLangage();
    }
}

function getLocalizedUrl(route) {
    if (route.charAt(0) !== '/') {
        route = '/' + route;
    }

    return '/' + lang + route;
}
