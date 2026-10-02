#ifndef DYNAMIC_ARRAY_H
#define DYNAMIC_ARRAY_H

#include <stddef.h>

typedef struct {
    void *data;
    size_t length;
    size_t capacity;
    size_t element_size;
} DynamicArray;

void da_init(DynamicArray *array, size_t element_size, size_t capacity);
void da_free(DynamicArray *array);
int da_push_back(DynamicArray *array, const void *value);
int da_insert(DynamicArray *array, size_t index, const void *value);
void da_remove_at(DynamicArray *array, size_t index);
void da_clear(DynamicArray *array);
void *da_at(DynamicArray *array, size_t index);
const void *da_at_const(const DynamicArray *array, size_t index);

#endif
