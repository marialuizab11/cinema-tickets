package com.es.cinema.tickets.exception.notfound;

import com.es.cinema.tickets.exception.ApiException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException(String detailMessage) {
        super("USER_NOT_FOUND", HttpStatus.NOT_FOUND, "Recurso não encontrado", detailMessage);
    }
}
