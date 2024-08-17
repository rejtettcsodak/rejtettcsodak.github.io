/*
    JS file for managing light / dark themes
    The toggle_theme(); function toggles the saved theme and updates the screen accordingly
    The remove_theme(); function removes the theme from localstorage and only updates the screen if it doesn't match the system settings
    The window.matchMedia(); function call watches for updates to system settings to keep localstorage settings accurate
*/

function get_system_theme() {
    /*
        Function for getting the system color scheme
    */

    theme = "dark";
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        theme = "light";
    }

    return theme;
}

function toggle_saved_theme() {
    /*
        Function for toggling between the two themes saved to local storage
        Returns:
            Value stored in local storage
    */

    // Gets Current Value
    if (localStorage.getItem("theme")) {
        theme = localStorage.getItem("theme");
    }
    else {
        theme = get_system_theme();
    }

    // Sets the stored value as the opposite
    if (theme === "light") {
        localStorage.setItem("theme", "dark");
    }
    else {
        localStorage.setItem("theme", "light");
    }

    return localStorage.getItem("theme");
}

function switch_theme_rules() {
    /*
        Function for switching the rules for perfers-color-scheme
        Goes through each style sheet file, then each rule within each stylesheet
        and looks for any rules that require a prefered colorscheme, 
        if it finds one that requires light theme then it makes it require dark theme / vise
        versa. The idea is that it will feel as though the themes switched even if they haven't. 
    */

    for (var sheet_file = 0; sheet_file < document.styleSheets.length; sheet_file++) {
        try {
            for (var sheet_rule = 0; sheet_rule < document.styleSheets[sheet_file].cssRules.length; sheet_rule++) {
                rule = document.styleSheets[sheet_file].cssRules[sheet_rule];

                if (rule && rule.media && rule.media.mediaText.includes("prefers-color-scheme")) {
                    rule_media = rule.media.mediaText;

                    if (rule_media.includes("light")) {
                        new_rule_media = rule_media.replace("light", "dark");
                    }
                    if (rule_media.includes("dark")) {
                        new_rule_media = rule_media.replace("dark", "light");
                    }
                    rule.media.deleteMedium(rule_media);
                    rule.media.appendMedium(new_rule_media);
                }
            }
        }
        catch (e) {
            broken_sheet = document.styleSheets[sheet_file].href;
            console.warn(broken_sheet + " broke something with theme toggle : " + e);
        }
    }
}

function toggle_theme() {
    /*
        Toggles the current theme used
    */
    stored_theme = toggle_saved_theme();
    switch_theme_rules();
}

function remove_theme() {
    /*
        Function for removing theme from local storage
    */
    if (localStorage.getItem("theme")) {
        if (get_system_theme() != localStorage.getItem("theme")) {
            switch_theme_rules();
        }
        localStorage.removeItem("theme");
    }
}

window.matchMedia('(prefers-color-scheme: dark)')
    /*
        This makes it such that if a user changes the theme on their
        browser and they have a preferred theme, the page maintains its prefered theme. 
    */
    .addEventListener("change", event => {
        if (localStorage.getItem("theme")) {
            switch_theme_rules(); // Switches Theme every time the prefered color gets updated
        }
    }
)

if (localStorage.getItem("theme")) {
    if (get_system_theme() != localStorage.getItem("theme")) {
        switch_theme_rules();
    }
}