export const setErrorMessage = (validationTypes: string): string => {
    switch (validationTypes) {
        case "minLength":
            return "Input is too short";
        case "maxLength":
            return "Input is too long";
        case "email":
            return "Please enter a valid email address.";
        case "password":
            return "Plase meet the password requirements";
        default:
            return "Invalid input";
    }
};

export const parseLocaStorageData = <T>(key: string): T => {
    return JSON.parse(localStorage.getItem(key) || '[]')
}