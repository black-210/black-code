#include "dynamic_array.h"

#include <stdlib.h>
#include <string.h>

void da_init(DynamicArray *array, size_t element_size, size_t capacity) {
    if (array == NULL || element_size == 0) {
        return;
    }

    array->data = NULL;
    array->length = 0;
    array->capacity = 0;
    array->element_size = element_size;

    if (capacity > 0) {
        array->data = calloc(capacity, element_size);
        if (array->data != NULL) {
            array->capacity = capacity;
        }
    }
}

void da_free(DynamicArray *array) {
    if (array == NULL) {
        return;
    }

    free(array->data);
    array->data = NULL;
    array->length = 0;
    array->capacity = 0;
    array->element_size = 0;
}

static int da_grow(DynamicArray *array) {
    size_t new_capacity = array->capacity == 0 ? 4 : array->capacity * 2;
    void *new_data = realloc(array->data, new_capacity * array->element_size);
    if (new_data == NULL) {
        return 0;
    }

    array->data = new_data;
    array->capacity = new_capacity;
    return 1;
}

int da_push_back(DynamicArray *array, const void *value) {
    if (array == NULL || value == NULL) {
        return 0;
    }

    if (array->length == array->capacity && !da_grow(array)) {
        return 0;
    }

    memcpy((char *)array->data + (array->length * array->element_size), value, array->element_size);
    array->length += 1;
    return 1;
}

int da_insert(DynamicArray *array, size_t index, const void *value) {
    if (array == NULL || value == NULL || index > array->length) {
        return 0;
    }

    if (array->length == array->capacity && !da_grow(array)) {
        return 0;
    }

    char *base = (char *)array->data;
    size_t offset = index * array->element_size;

    if (index < array->length) {
        memmove(base + (index + 1) * array->element_size,
                base + index * array->element_size,
                (array->length - index) * array->element_size);
    }

    memcpy(base + offset, value, array->element_size);
    array->length += 1;
    return 1;
}

void da_remove_at(DynamicArray *array, size_t index) {
    if (array == NULL || index >= array->length) {
        return;
    }

    char *base = (char *)array->data;
    size_t tail_size = (array->length - index - 1) * array->element_size;

    if (tail_size > 0) {
        memmove(base + index * array->element_size,
                base + (index + 1) * array->element_size,
                tail_size);
    }

    array->length -= 1;
}

void da_clear(DynamicArray *array) {
    if (array != NULL) {
        array->length = 0;
    }
}

void *da_at(DynamicArray *array, size_t index) {
    if (array == NULL || index >= array->length) {
        return NULL;
    }

    return (char *)array->data + (index * array->element_size);
}

const void *da_at_const(const DynamicArray *array, size_t index) {
    if (array == NULL || index >= array->length) {
        return NULL;
    }

    return (const char *)array->data + (index * array->element_size);
}
