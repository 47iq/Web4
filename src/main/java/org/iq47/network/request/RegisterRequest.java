package org.iq47.network.request;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Data
@ToString
public class RegisterRequest implements Serializable {
    private String username;
    private String password;
    private List<String> roles;
}
