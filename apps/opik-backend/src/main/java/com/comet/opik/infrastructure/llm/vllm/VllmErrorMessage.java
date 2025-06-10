package com.comet.opik.infrastructure.llm.vllm;

import com.comet.opik.infrastructure.llm.LlmProviderError;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.dropwizard.jersey.errors.ErrorMessage;
import jakarta.validation.constraints.NotBlank;

import static com.comet.opik.infrastructure.llm.vllm.VllmErrorMessage.VllmError;

public record VllmErrorMessage(VllmError error) implements LlmProviderError<VllmError> {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record VllmError(@NotBlank String message, @NotBlank String code, @NotBlank String type) {
    }

    public ErrorMessage toErrorMessage() {
        String message = error.message();

        if (message == null) {
            return null;
        }

        Integer code = getCode(error);

        if (code != null) {
            return new ErrorMessage(code, message);
        }

        return new ErrorMessage(500, error.message(), error.code);
    }

    private Integer getCode(VllmError error) {
        return switch (error.code) {
            case "invalid_api_key" -> 401;
            case "internal_error" -> 500;
            default -> null;
        };
    }
}
