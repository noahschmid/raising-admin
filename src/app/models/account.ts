/**
 * User Model for better type oriented programming
 */
export class Account {
    /**
     * The token of the user
     */
    token?: string;

    /**
     * The email of the user
     */
    email: string;

    /**
     * @ignore
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * @ignore
     */
    setEmail(email) {
        this.email = email;
    }
}
