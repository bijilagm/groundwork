package com.groundwork.auth.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        UUID id,
        String firstName,
        String lastName,
        String email) {
}
