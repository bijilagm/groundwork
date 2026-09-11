package com.groundwork.auth;

public class EmailAlreadyUsedException extends RuntimeException {

    public EmailAlreadyUsedException(String email) {
        super("An account with email '" + email + "' already exists");
    }
}
