package org.iq47.exception;

public class PointSaveException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final String message;

    public PointSaveException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
