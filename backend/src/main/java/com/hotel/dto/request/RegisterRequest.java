package com.hotel.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "First name required") private String firstName;
    @NotBlank(message = "Last name required") private String lastName;
    @Email @NotBlank(message = "Email required") private String email;
    @Size(min = 6, message = "Password must be at least 6 characters") @NotBlank private String password;
    private String phone;
}
