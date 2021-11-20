package org.iq47.network.request;

import lombok.Data;
import lombok.ToString;

import java.io.Serializable;

@Data
@ToString
public class LoginRequest implements Serializable {
    String username;
    String password;
}
