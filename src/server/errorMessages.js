const errorMessagesEnum = {
    LOGIN: {
        NO_USERNAME: "Error with your username, username only takes alphanumeric characters",
        USERNAME_ALREADY_EXISTS: "Username already exists",
        USERNAME_LENGTH: "Username too long, username length should be 8 or less",
        NO_FILE: "The image field has not been detected, pick an image",
        FILE_SIZE: "The image size is too heavy, the maximum size is 100 Ko",
        NOT_IMAGE: "The file sent is not recognized as an image, please ensure to select a PNG or JPEG",
        EMPTY_FIELDS: "You cannot connect without an username and an image"
    }
};

export default errorMessagesEnum;