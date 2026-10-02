#include "string_utils.h"

#include <ctype.h>
#include <stdlib.h>
#include <string.h>

char *su_strdup_safe(const char *src) {
    if (src == NULL) {
        return NULL;
    }

    size_t length = strlen(src) + 1;
    char *copy = (char *)malloc(length);
    if (copy == NULL) {
        return NULL;
    }

    memcpy(copy, src, length);
    return copy;
}

char *su_trim(char *str) {
    if (str == NULL) {
        return NULL;
    }

    char *start = str;
    while (*start != '\0' && isspace((unsigned char)*start)) {
        start += 1;
    }

    if (*start == '\0') {
        return start;
    }

    char *end = start + strlen(start) - 1;
    while (end > start && isspace((unsigned char)*end)) {
        *end = '\0';
        end -= 1;
    }

    memmove(str, start, strlen(start) + 1);
    return str;
}

char *su_join(const char *left, const char *right) {
    if (left == NULL && right == NULL) {
        return su_strdup_safe("");
    }

    size_t left_len = left == NULL ? 0 : strlen(left);
    size_t right_len = right == NULL ? 0 : strlen(right);
    size_t total = left_len + right_len + 1;

    char *joined = (char *)malloc(total);
    if (joined == NULL) {
        return NULL;
    }

    if (left != NULL) {
        memcpy(joined, left, left_len);
    }
    if (right != NULL) {
        memcpy(joined + left_len, right, right_len);
    }
    joined[total - 1] = '\0';
    return joined;
}

char *su_to_upper(const char *src) {
    if (src == NULL) {
        return NULL;
    }

    size_t length = strlen(src) + 1;
    char *copy = (char *)malloc(length);
    if (copy == NULL) {
        return NULL;
    }

    for (size_t i = 0; i < length; ++i) {
        copy[i] = (char)toupper((unsigned char)src[i]);
    }

    return copy;
}
