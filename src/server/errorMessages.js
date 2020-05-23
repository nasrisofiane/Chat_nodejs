import { imageLimit } from './utils/multerConfig';
import { usernameMaxLength } from './controller';

const errorMessagesEnum = {
    LOGIN: {
        NO_USERNAME: "Username only takes alphanumeric characters",
        USERNAME_ALREADY_EXISTS: "Username already exists",
        USERNAME_LENGTH: "Username length should be 8 or less",
        NO_FILE: "The image field has not been detected",
        FILE_SIZE: `File size too big, maximum authorized is ${imageLimit / 1000} ko`,
        NOT_IMAGE: "Please ensure to select a PNG or JPEG",
        EMPTY_FIELDS: "Empty fields"
    }
};

export default errorMessagesEnum;