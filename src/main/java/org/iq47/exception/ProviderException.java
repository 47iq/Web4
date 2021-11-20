package org.iq47.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
public class ProviderException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    @Getter
    private final String message;
    @Getter
    private final HttpStatus httpStatus;

}
