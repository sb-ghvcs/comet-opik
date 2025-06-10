package com.comet.opik.infrastructure.llm.vllm;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.Optional;

/**
 * This information is taken from <a href="https://platform.openai.com/docs/models">openai docs</a>
 */
@Slf4j
@RequiredArgsConstructor
@Getter
@Accessors(fluent = true)
public enum VllmModelName {
    // TODO: How do we build this enum dynamically from the vllm server?
    GEMINI_2_5_PRO_PREVIEW_04_17("vertex_ai/gemini-2.5-flash-preview-04-17", "gemini-2.5-flash-preview-04-17"),
    ;

    private static final String WARNING_UNKNOWN_MODEL = "could not find VllmModelName with value '{}'";

    private final String qualifiedName;
    private final String value;

    public static Optional<VllmModelName> byQualifiedName(String qualifiedName) {
        var response = Arrays.stream(VllmModelName.values())
                .filter(modelName -> modelName.qualifiedName.equals(qualifiedName))
                .findFirst();
        if (response.isEmpty()) {
            log.warn(WARNING_UNKNOWN_MODEL, qualifiedName);
        }
        return response;
    }

    @Override
    public String toString() {
        return value;
    }
}
